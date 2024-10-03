import { Test, TestingModule } from '@nestjs/testing';
import { FoodCategoryController } from './food_category.controller';
import { FoodCategoryService } from './food_category.service';

describe('AppController', () => {
  let foodCategoryController: FoodCategoryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FoodCategoryController],
      providers: [FoodCategoryService],
    }).compile();

    foodCategoryController = app.get<FoodCategoryController>(
      FoodCategoryController,
    );
  });

  describe('root', () => {
    it('should return "Welcome to the FoodCategory !"', () => {
      expect(foodCategoryController.Welcome()).toBe(
        'Welcome to the FoodCategory !',
      );
    });
  });
});
