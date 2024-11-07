import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import {
  NotFoundException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RestaurantDto } from './DTO/restaurants.dto';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;

  const mockRestaurantsService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: mockRestaurantsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
  });

  describe('getAllRestaurants', () => {
    it('should return all restaurants', async () => {
      const mockRestaurants = [
        { id: 1, name: 'Restaurant 1' },
        { id: 2, name: 'Restaurant 2' },
      ];
      mockRestaurantsService.findAll.mockResolvedValue(mockRestaurants);

      const result = await controller.getAllRestaurants();
      expect(result).toEqual(mockRestaurants);
    });

    it('should throw NotFoundException when no restaurants found', async () => {
      mockRestaurantsService.findAll.mockResolvedValue([]);
      await expect(controller.getAllRestaurants()).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockRestaurantsService.findAll.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.getAllRestaurants()).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getOneRestaurant', () => {
    it('should return a single restaurant', async () => {
      const mockRestaurant = { id: 1, name: 'Restaurant 1' };
      mockRestaurantsService.findById.mockResolvedValue(mockRestaurant);

      const result = await controller.getOneRestaurant(1);
      expect(result).toEqual(mockRestaurant);
    });

    it('should throw NotFoundException when restaurant not found', async () => {
      mockRestaurantsService.findById.mockResolvedValue(null);
      await expect(controller.getOneRestaurant(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockRestaurantsService.findById.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.getOneRestaurant(1)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('createRestaurant', () => {
    const createRestaurantDto: RestaurantDto = {
      name: 'New Restaurant',
      location: '123 Test St',
      ingredients: [],
      details: [],
      food_category: [],
      foods: [],
      orders: [],
      users: [],
    };

    it('should create restaurant successfully', async () => {
      const mockCreatedRestaurant = {
        insertedId: 'some-id',
        acknowledged: true,
      };
      mockRestaurantsService.createOne.mockResolvedValue(mockCreatedRestaurant);

      const result = await controller.createRestaurant(createRestaurantDto);
      expect(result).toEqual(mockCreatedRestaurant);
    });

    it('should throw BadRequestException when creation fails', async () => {
      mockRestaurantsService.createOne.mockResolvedValue(null);
      await expect(
        controller.createRestaurant(createRestaurantDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle service error', async () => {
      mockRestaurantsService.createOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(
        controller.createRestaurant(createRestaurantDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateOneRestaurant', () => {
    const updateRestaurantDto: RestaurantDto = {
      name: 'Updated Restaurant',
      location: '456 Test Ave',
      ingredients: [],
      details: [],
      food_category: [],
      foods: [],
      orders: [],
      users: [],
    };

    it('should update restaurant successfully', async () => {
      mockRestaurantsService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      await controller.updateOneRestaurant(1, updateRestaurantDto);
      expect(mockRestaurantsService.updateOne).toHaveBeenCalledWith(
        1,
        updateRestaurantDto,
      );
    });

    it('should throw NotFoundException when restaurant not found', async () => {
      mockRestaurantsService.updateOne.mockResolvedValue({
        matchedCount: 0,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneRestaurant(1, updateRestaurantDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no changes made', async () => {
      mockRestaurantsService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneRestaurant(1, updateRestaurantDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle service error', async () => {
      mockRestaurantsService.updateOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(
        controller.updateOneRestaurant(1, updateRestaurantDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteOneRestaurant', () => {
    it('should delete restaurant successfully', async () => {
      mockRestaurantsService.deleteOne.mockResolvedValue({
        deletedCount: 1,
      });

      await controller.deleteOneRestaurant(1);
      expect(mockRestaurantsService.deleteOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when restaurant not found', async () => {
      mockRestaurantsService.deleteOne.mockResolvedValue({
        deletedCount: 0,
      });

      await expect(controller.deleteOneRestaurant(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockRestaurantsService.deleteOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.deleteOneRestaurant(1)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
