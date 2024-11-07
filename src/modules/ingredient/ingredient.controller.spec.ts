import { Test, TestingModule } from '@nestjs/testing';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';
import {
  NotFoundException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { IngredientDto } from './DTO/ingredient.dto';

describe('IngredientController', () => {
  let controller: IngredientController;

  const mockIngredientService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngredientController],
      providers: [
        {
          provide: IngredientService,
          useValue: mockIngredientService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<IngredientController>(IngredientController);
  });

  describe('getAllIngredient', () => {
    it('should return all ingredients', async () => {
      const mockIngredients = {
        ingredients: [
          { id: 1, name: 'Tomate', price: 2, quantity: 100, unit: 'g' },
          { id: 2, name: 'Oignon', price: 1, quantity: 50, unit: 'g' },
        ],
      };
      mockIngredientService.findAll.mockResolvedValue(mockIngredients);

      const result = await controller.getAllIngredient(1);
      expect(result).toEqual(mockIngredients.ingredients);
      expect(mockIngredientService.findAll).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when no ingredients found', async () => {
      mockIngredientService.findAll.mockResolvedValue(null);
      await expect(controller.getAllIngredient(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockIngredientService.findAll.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.getAllIngredient(1)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getOneIngredient', () => {
    it('should return a single ingredient', async () => {
      const mockIngredient = {
        ingredients: [
          { id: 1, name: 'Tomate', price: 2, quantity: 100, unit: 'g' },
        ],
      };
      mockIngredientService.findById.mockResolvedValue(mockIngredient);

      const result = await controller.getOneIngredient(1, 1);
      expect(result).toEqual(mockIngredient.ingredients[0]);
      expect(mockIngredientService.findById).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when ingredient not found', async () => {
      mockIngredientService.findById.mockResolvedValue(null);
      await expect(controller.getOneIngredient(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockIngredientService.findById.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.getOneIngredient(1, 1)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('createIngredient', () => {
    const createIngredientDto: IngredientDto = {
      name: 'Nouvel ingrédient',
      price: 3,
      quantity: 200,
      unit: 'g',
    };

    it('should create an ingredient successfully', async () => {
      mockIngredientService.createOne.mockResolvedValue({
        modifiedCount: 1,
        matchedCount: 1,
      });

      await controller.createIngredient(1, createIngredientDto);
      expect(mockIngredientService.createOne).toHaveBeenCalledWith(
        1,
        createIngredientDto,
      );
    });

    it('should throw NotFoundException when restaurant not found', async () => {
      mockIngredientService.createOne.mockResolvedValue({
        modifiedCount: 0,
        matchedCount: 0,
      });

      await expect(
        controller.createIngredient(1, createIngredientDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle service error', async () => {
      mockIngredientService.createOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(
        controller.createIngredient(1, createIngredientDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateOneIngredient', () => {
    const updateIngredientDto: IngredientDto = {
      name: 'Ingrédient mis à jour',
      price: 4,
      quantity: 150,
      unit: 'g',
    };

    it('should update an ingredient successfully', async () => {
      mockIngredientService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      await controller.updateOneIngredient(1, 1, updateIngredientDto);
      expect(mockIngredientService.updateOne).toHaveBeenCalledWith(
        1,
        1,
        updateIngredientDto,
      );
    });

    it('should throw NotFoundException when ingredient not found', async () => {
      mockIngredientService.updateOne.mockResolvedValue({
        matchedCount: 0,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneIngredient(1, 1, updateIngredientDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no changes made', async () => {
      mockIngredientService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneIngredient(1, 1, updateIngredientDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle service error', async () => {
      mockIngredientService.updateOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(
        controller.updateOneIngredient(1, 1, updateIngredientDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteOneIngredient', () => {
    it('should delete an ingredient successfully', async () => {
      mockIngredientService.deleteOne.mockResolvedValue({
        modifiedCount: 1,
      });

      await controller.deleteOneIngredient(1, 1);
      expect(mockIngredientService.deleteOne).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when ingredient not found', async () => {
      mockIngredientService.deleteOne.mockResolvedValue({
        modifiedCount: 0,
      });

      await expect(controller.deleteOneIngredient(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockIngredientService.deleteOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.deleteOneIngredient(1, 1)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
