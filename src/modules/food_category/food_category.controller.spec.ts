import { Test, TestingModule } from '@nestjs/testing';
import { FoodCategoryController } from './food_category.controller';
import { FoodCategoryService } from './food_category.service';
import {
  NotFoundException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { FoodCategoryDto } from './DTO/food_category.dto';

describe('FoodCategoryController', () => {
  let controller: FoodCategoryController;

  const mockFoodCategoryService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodCategoryController],
      providers: [
        {
          provide: FoodCategoryService,
          useValue: mockFoodCategoryService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FoodCategoryController>(FoodCategoryController);
  });

  describe('getAllFoodCategory', () => {
    it('should return all food categories', async () => {
      const mockCategories = {
        food_category: [
          { id: 1, name: 'Entrées' },
          { id: 2, name: 'Plats principaux' },
        ],
      };
      mockFoodCategoryService.findAll.mockResolvedValue(mockCategories);

      const result = await controller.getAllFoodCategory(1);
      expect(result).toEqual(mockCategories.food_category);
      expect(mockFoodCategoryService.findAll).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when no categories found', async () => {
      mockFoodCategoryService.findAll.mockResolvedValue(null);
      await expect(controller.getAllFoodCategory(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockFoodCategoryService.findAll.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.getAllFoodCategory(1)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getOneFoodCategory', () => {
    it('should return a single food category', async () => {
      const mockCategory = {
        food_category: [{ id: 1, name: 'Entrées' }],
      };
      mockFoodCategoryService.findById.mockResolvedValue(mockCategory);

      const result = await controller.getOneFoodCategory(1, 1);
      expect(result).toEqual(mockCategory.food_category[0]);
      expect(mockFoodCategoryService.findById).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockFoodCategoryService.findById.mockResolvedValue(null);
      await expect(controller.getOneFoodCategory(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockFoodCategoryService.findById.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.getOneFoodCategory(1, 1)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('createFoodCategory', () => {
    const createFoodCategoryDto: FoodCategoryDto = {
      name: 'Nouvelle catégorie',
    };

    it('should create a food category successfully', async () => {
      mockFoodCategoryService.createOne.mockResolvedValue({
        modifiedCount: 1,
        matchedCount: 1,
      });

      await controller.createFoodCategory(1, createFoodCategoryDto);
      expect(mockFoodCategoryService.createOne).toHaveBeenCalledWith(
        1,
        createFoodCategoryDto,
      );
    });

    it('should throw NotFoundException when restaurant not found', async () => {
      mockFoodCategoryService.createOne.mockResolvedValue({
        modifiedCount: 0,
        matchedCount: 0,
      });

      await expect(
        controller.createFoodCategory(1, createFoodCategoryDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle service error', async () => {
      mockFoodCategoryService.createOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(
        controller.createFoodCategory(1, createFoodCategoryDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateOneFoodCategory', () => {
    const updateFoodCategoryDto: FoodCategoryDto = {
      name: 'Catégorie mise à jour',
    };

    it('should update a food category successfully', async () => {
      mockFoodCategoryService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      await controller.updateOneFoodCategory(1, 1, updateFoodCategoryDto);
      expect(mockFoodCategoryService.updateOne).toHaveBeenCalledWith(
        1,
        1,
        updateFoodCategoryDto,
      );
    });

    it('should throw NotFoundException when category not found', async () => {
      mockFoodCategoryService.updateOne.mockResolvedValue({
        matchedCount: 0,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneFoodCategory(1, 1, updateFoodCategoryDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no changes made', async () => {
      mockFoodCategoryService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneFoodCategory(1, 1, updateFoodCategoryDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle service error', async () => {
      mockFoodCategoryService.updateOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(
        controller.updateOneFoodCategory(1, 1, updateFoodCategoryDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteOneFoodCategory', () => {
    it('should delete a food category successfully', async () => {
      mockFoodCategoryService.deleteOne.mockResolvedValue({
        modifiedCount: 1,
      });

      await controller.deleteOneFoodCategory(1, 1);
      expect(mockFoodCategoryService.deleteOne).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockFoodCategoryService.deleteOne.mockResolvedValue({
        modifiedCount: 0,
      });

      await expect(controller.deleteOneFoodCategory(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockFoodCategoryService.deleteOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.deleteOneFoodCategory(1, 1)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
