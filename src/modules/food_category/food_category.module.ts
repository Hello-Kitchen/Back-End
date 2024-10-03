import { Module } from '@nestjs/common';
import { FoodCategoryController } from './food_category.controller';
import { FoodCategoryService } from './food_category.service';

@Module({
  imports: [],
  controllers: [FoodCategoryController],
  providers: [FoodCategoryService],
})
export class FoodCategoryModule {}
