import { Test, TestingModule } from '@nestjs/testing';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { NotFoundException, HttpException } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { FoodDto } from './DTO/food.dto';

describe('FoodController', () => {
  let controller: FoodController;

  const mockFoodService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodController],
      providers: [
        {
          provide: FoodService,
          useValue: mockFoodService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FoodController>(FoodController);
  });

  describe('getAllFood', () => {
    it('should return all food items for a restaurant', async () => {
      const mockFoods = {
        foods: [
          { id: 1, name: 'Pizza', price: 10 },
          { id: 2, name: 'Burger', price: 8 },
        ],
      };
      mockFoodService.findAll.mockResolvedValue(mockFoods);

      const result = await controller.getAllFood(1, -1);
      expect(result).toEqual(mockFoods.foods);
      expect(mockFoodService.findAll).toHaveBeenCalledWith(1);
    });

    it('should return all food items for a restaurant matching with category', async () => {
      const mockFoods = {
        foods: [
          { id: 1, name: 'Pizza', price: 10, id_category: 1 },
          { id: 2, name: 'Burger', price: 8, id_category: 2 },
        ],
      };
      mockFoodService.findAll.mockResolvedValue(mockFoods);

      const result = await controller.getAllFood(1, 1);
      expect(result[0]).toEqual(mockFoods.foods[0]);
      expect(mockFoodService.findAll).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when no foods found', async () => {
      mockFoodService.findAll.mockResolvedValue(null);
      await expect(controller.getAllFood(1, -1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockFoodService.findAll.mockRejectedValue(new Error('Database error'));
      await expect(controller.getAllFood(1, -1)).rejects.toThrow(HttpException);
    });
  });

  describe('getOneFood', () => {
    it('should return a single food item', async () => {
      const mockFood = {
        foods: [{ id: 1, name: 'Pizza', price: 10 }],
      };
      mockFoodService.findById.mockResolvedValue(mockFood);

      const result = await controller.getOneFood(1, 1);
      expect(result).toEqual(mockFood.foods[0]);
      expect(mockFoodService.findById).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when food not found', async () => {
      mockFoodService.findById.mockResolvedValue(null);
      await expect(controller.getOneFood(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockFoodService.findById.mockRejectedValue(new Error('Database error'));
      await expect(controller.getOneFood(1, 1)).rejects.toThrow(HttpException);
    });
  });

  describe('createFood', () => {
    const createFoodDto: FoodDto = {
      name: 'New Pizza',
      price: 12,
      id_category: 1,
      ingredients: [1, 2, 3],
      details: [1, 2],
    };

    it('should create a food item successfully', async () => {
      mockFoodService.createOne.mockResolvedValue({
        modifiedCount: 1,
        matchedCount: 1,
      });

      await controller.createFood(1, createFoodDto);
      expect(mockFoodService.createOne).toHaveBeenCalledWith(1, createFoodDto);
    });

    it('should throw NotFoundException when restaurant not found', async () => {
      mockFoodService.createOne.mockResolvedValue({
        modifiedCount: 0,
        matchedCount: 0,
      });

      await expect(controller.createFood(1, createFoodDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockFoodService.createOne.mockRejectedValue(new Error('Database error'));
      await expect(controller.createFood(1, createFoodDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updateOneFood', () => {
    const updateFoodDto: FoodDto = {
      name: 'Updated Pizza',
      price: 15,
      id_category: 1,
      ingredients: [1, 2, 3],
      details: [1, 2],
    };

    it('should update a food item successfully', async () => {
      mockFoodService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      await controller.updateOneFood(1, 1, updateFoodDto);
      expect(mockFoodService.updateOne).toHaveBeenCalledWith(
        1,
        1,
        updateFoodDto,
      );
    });

    it('should throw NotFoundException when food not found', async () => {
      mockFoodService.updateOne.mockResolvedValue({
        matchedCount: 0,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneFood(1, 1, updateFoodDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when no changes made', async () => {
      mockFoodService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneFood(1, 1, updateFoodDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle service error', async () => {
      mockFoodService.updateOne.mockRejectedValue(new Error('Database error'));
      await expect(
        controller.updateOneFood(1, 1, updateFoodDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteOneFood', () => {
    it('should delete a food item successfully', async () => {
      mockFoodService.deleteOne.mockResolvedValue({
        modifiedCount: 1,
      });

      await controller.deleteOneFood(1, 1);
      expect(mockFoodService.deleteOne).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when food not found', async () => {
      mockFoodService.deleteOne.mockResolvedValue({
        modifiedCount: 0,
      });

      await expect(controller.deleteOneFood(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockFoodService.deleteOne.mockRejectedValue(new Error('Database error'));
      await expect(controller.deleteOneFood(1, 1)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
