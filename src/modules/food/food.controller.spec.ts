import { Test, TestingModule } from '@nestjs/testing';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';

describe('FoodController', () => {
  let foodController: FoodController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FoodController],
      providers: [FoodService],
    }).compile();

    foodController = app.get<FoodController>(FoodController);
  });

  describe('root', () => {
    it('should return "Welcome to the Food !"', () => {
      expect(foodController.Welcome()).toBe('Welcome to the Food !');
    });
  });
});
