import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DetailsModule } from './details/details.module'
import { FoodModule } from './food/food.module';
import { FoodCategoryModule } from './food_category/food_category.module';
import { FoodOrderedModule } from './food_ordered/food_ordered.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { LoginModule } from './login/login.module';
import { OrdersModule } from './orders/orders.module';
import { PermissionModule } from './permission/permission.module';
import { PosModule } from './pos/pos.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DetailsModule, FoodModule, FoodCategoryModule, 
    FoodOrderedModule, IngredientModule, LoginModule, 
    OrdersModule, PermissionModule, PosModule, 
    RestaurantsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
