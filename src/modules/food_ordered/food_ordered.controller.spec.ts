import { Test, TestingModule } from '@nestjs/testing';
import { FoodOrderedController } from './food_ordered.controller';
import { FoodOrderedService } from './food_ordered.service';

describe('FoodOrderedController', () => {
  let foodOrderedController: FoodOrderedController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FoodOrderedController],
      providers: [FoodOrderedService],
    }).compile();

    foodOrderedController = app.get<FoodOrderedController>(
      FoodOrderedController,
    );
  });

  describe('root', () => {
    it('should return "Welcome to the FoodOrdered !"', () => {
      expect(foodOrderedController.Welcome()).toBe(
        'Welcome to the FoodOrdered !',
      );
    });
  });
});
