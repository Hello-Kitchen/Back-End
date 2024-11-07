import { Test, TestingModule } from '@nestjs/testing';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';
import { NotFoundException, HttpException } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

describe('PosController', () => {
  let controller: PosController;

  const mockPosService = {
    findRestaurant: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PosController],
      providers: [
        {
          provide: PosService,
          useValue: mockPosService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PosController>(PosController);
  });

  describe('getAllDataPOS', () => {
    const mockRestaurant = {
      id: 1,
      foods: [
        {
          id: 1,
          name: 'Pizza',
          id_category: 1,
          price: 10,
          details: [1, 2],
          ingredients: [1, 2],
        },
      ],
      details: [
        { id: 1, name: 'Spicy' },
        { id: 2, name: 'Vegetarian' },
      ],
      ingredients: [
        { id: 1, name: 'Tomato' },
        { id: 2, name: 'Cheese' },
      ],
      food_category: [{ id: 1, name: 'Italian' }],
    };

    it('should return structured food data', async () => {
      mockPosService.findRestaurant.mockResolvedValue(mockRestaurant);

      const result = await controller.getAllDataPOS(1);

      expect(result).toEqual([
        {
          id: 1,
          name: 'Italian',
          food: [
            {
              id: 1,
              name: 'Pizza',
              id_category: 1,
              price: 10,
              details: [
                { id: 1, name: 'Spicy' },
                { id: 2, name: 'Vegetarian' },
              ],
              ingredients: [
                { id: 1, name: 'Tomato' },
                { id: 2, name: 'Cheese' },
              ],
            },
          ],
        },
      ]);
    });

    it('should handle empty arrays correctly', async () => {
      const emptyRestaurant = {
        id: 1,
        foods: [],
        details: [],
        ingredients: [],
        food_category: [],
      };
      mockPosService.findRestaurant.mockResolvedValue(emptyRestaurant);

      const result = await controller.getAllDataPOS(1);
      expect(result).toEqual([]);
    });

    it('should handle null values in food details and ingredients', async () => {
      const restaurantWithNulls = {
        ...mockRestaurant,
        foods: [
          {
            id: 1,
            name: 'Pizza',
            id_category: 1,
            price: 10,
            details: null,
            ingredients: null,
          },
        ],
      };
      mockPosService.findRestaurant.mockResolvedValue(restaurantWithNulls);

      const result = await controller.getAllDataPOS(1);
      expect(result[0].food[0].details).toEqual([]);
      expect(result[0].food[0].ingredients).toEqual([]);
    });

    it('should throw NotFoundException when restaurant not found', async () => {
      mockPosService.findRestaurant.mockResolvedValue(null);
      await expect(controller.getAllDataPOS(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockPosService.findRestaurant.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.getAllDataPOS(1)).rejects.toThrow(HttpException);
    });
  });
});
