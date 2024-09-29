import { Module } from '@nestjs/common';
import { FoodOrderedController } from './food_ordered.controller';
import { FoodOrderedService } from './food_ordered.service';

@Module({
  imports: [],
  controllers: [FoodOrderedController],
  providers: [FoodOrderedService],
})
export class FoodOrderedModule {}
