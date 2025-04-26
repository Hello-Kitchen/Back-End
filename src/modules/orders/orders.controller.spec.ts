import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import {
  NotFoundException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { OrdersDto } from './DTO/orders.dto';

describe('OrdersController', () => {
  let controller: OrdersController;

  const mockOrdersService = {
    findAll: jest.fn(),
    findPending: jest.fn(),
    findReady: jest.fn(),
    findAllSortedByDate: jest.fn(),
    findPendingSortedByDate: jest.fn(),
    findReadySortedByDate: jest.fn(),
    findById: jest.fn(),
    findByIdWithParam: jest.fn(),
    findFoodByIdsWithParam: jest.fn(),
    findOrderWithParam: jest.fn(),
    createOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    markFoodOrderedReady: jest.fn(),
    incrementOrderPart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  describe('getOrders', () => {
    it('should return all orders when no query params', async () => {
      const mockOrders = [{ id: 1 }, { id: 2 }];
      mockOrdersService.findAll.mockResolvedValue(mockOrders);

      const result = await controller.getOrders('', '', undefined, 1);
      expect(result).toEqual(mockOrders);
    });

    it('should return pending orders', async () => {
      const mockPendingOrders = [{ id: 1, status: 'pending' }];
      mockOrdersService.findPending.mockResolvedValue(mockPendingOrders);

      const result = await controller.getOrders('pending', '', undefined, 1);
      expect(result).toEqual(mockPendingOrders);
    });

    it('should return ready orders sorted by time', async () => {
      const mockReadyOrders = [{ id: 1, status: 'ready', date: new Date() }];
      mockOrdersService.findReadySortedByDate.mockResolvedValue(
        mockReadyOrders,
      );

      const result = await controller.getOrders('ready', 'time', undefined, 1);
      expect(result).toEqual(mockReadyOrders);
    });

    it('should return order who is served', async () => {
      const mockReadyOrders = [
        { id: 1, status: 'ready', date: new Date(), served: true },
      ];
      mockOrdersService.findOrderWithParam.mockResolvedValue(mockReadyOrders);

      const result = await controller.getOrders('served', '', undefined, 1);
      expect(result).toEqual(mockReadyOrders);
    });

    it('should handle service error', async () => {
      mockOrdersService.findAll.mockRejectedValue(new Error('Database error'));
      await expect(controller.getOrders('', '', undefined, 1)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getOneOrder', () => {
    const mockOrder = {
      orders: [
        {
          id: 1,
          food_ordered: [
            { food: 1, is_ready: false, details: [], mods_ingredients: [] },
          ],
        },
      ],
    };

    it('should return order details for non-KDS request', async () => {
      mockOrdersService.findById.mockResolvedValue(mockOrder);
      mockOrdersService.findFoodByIdsWithParam.mockResolvedValue({
        foods: [{ name: 'Test Food' }],
      });

      const result = await controller.getOneOrder('false', 1, 1);
      expect(result).toBeDefined();
      expect(mockOrdersService.findById).toHaveBeenCalledWith(1, 1);
    });

    it('should return order details for KDS request', async () => {
      mockOrdersService.findByIdWithParam.mockResolvedValue([
        {
          food_ordered: [{ food: 1, is_ready: false }],
        },
      ]);
      mockOrdersService.findFoodByIdsWithParam.mockResolvedValue({
        foods: [{ name: 'Test Food' }],
      });

      const result = await controller.getOneOrder('true', 1, 1);
      expect(result).toBeDefined();
      expect(mockOrdersService.findByIdWithParam).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('createOrder', () => {
    const createOrderDto: OrdersDto = {
      channel: 'web',
      number: '123',
      food_ordered: [],
      part: 1,
      date: new Date().toISOString(),
      served: false,
    };

    it('should create order successfully', async () => {
      mockOrdersService.createOne.mockResolvedValue({
        sequence_value: 1,
        _id: 1,
      });

      const result = await controller.createOrder(createOrderDto, 1, 1);
      expect(result.sequence_value).toBe(1);
      expect(mockOrdersService.createOne).toHaveBeenCalledWith(
        1,
        createOrderDto,
        1,
      );
    });
  });

  describe('updateOneOrder', () => {
    const updateOrderDto: OrdersDto = {
      channel: 'web',
      number: '123',
      food_ordered: [],
      part: 1,
      date: new Date().toISOString(),
      served: false,
    };

    it('should update order successfully', async () => {
      mockOrdersService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      await controller.updateOneOrder(1, updateOrderDto, 1);
      expect(mockOrdersService.updateOne).toHaveBeenCalledWith(
        1,
        1,
        updateOrderDto,
      );
    });

    it('should throw NotFoundException when order not found', async () => {
      mockOrdersService.updateOne.mockResolvedValue({
        matchedCount: 0,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneOrder(1, updateOrderDto, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no changes made', async () => {
      mockOrdersService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneOrder(1, updateOrderDto, 1),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteOneOrder', () => {
    it('should delete order successfully', async () => {
      mockOrdersService.deleteOne.mockResolvedValue({
        modifiedCount: 1,
      });

      await controller.deleteOneOrder(1, 1);
      expect(mockOrdersService.deleteOne).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when order not found', async () => {
      mockOrdersService.deleteOne.mockResolvedValue({
        modifiedCount: 0,
      });

      await expect(controller.deleteOneOrder(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('ChangeStatusFoodOrdered', () => {
    it('should change food order status successfully', async () => {
      mockOrdersService.markFoodOrderedReady.mockResolvedValue({
        modifiedCount: 1,
      });

      await controller.ChangeStatusFoodOrdered(1, 1);
      expect(mockOrdersService.markFoodOrderedReady).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when food order not found', async () => {
      mockOrdersService.markFoodOrderedReady.mockResolvedValue({
        modifiedCount: 0,
      });

      await expect(controller.ChangeStatusFoodOrdered(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('ChangePartOrder', () => {
    it('should change order part successfully', async () => {
      mockOrdersService.incrementOrderPart.mockResolvedValue({
        modifiedCount: 1,
      });

      await controller.ChangePartOrder(1, 1);
      expect(mockOrdersService.incrementOrderPart).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when order not found', async () => {
      mockOrdersService.incrementOrderPart.mockResolvedValue({
        modifiedCount: 0,
      });

      await expect(controller.ChangePartOrder(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
