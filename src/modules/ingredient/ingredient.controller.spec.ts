import { Test, TestingModule } from '@nestjs/testing';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';

describe('IngredientController', () => {
  let ingredientController: IngredientController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IngredientController],
      providers: [IngredientService],
    }).compile();

    ingredientController = app.get<IngredientController>(IngredientController);
  });

  describe('root', () => {
    it('should return "Welcome to the Ingredient !"', () => {
      expect(ingredientController.Welcome()).toBe(
        'Welcome to the Ingredient !',
      );
    });
  });
});
