/**
 * The AppModule class is the root module of the application.
 * It imports all the necessary modules and provides the application's controllers and services.
 *
 * @module AppModule
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DetailsModule } from './modules/details/details.module';
import { FoodModule } from './modules/food/food.module';
import { FoodCategoryModule } from './modules/food_category/food_category.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';
import { LoginModule } from './modules/login/login.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PermissionModule } from './modules/permission/permission.module';
import { PosModule } from './modules/pos/pos.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { UsersModule } from './modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { HealthModule } from './modules/health/health.module';
import { TableModule } from './modules/table/table.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }) /**< Register new configuration authentification */,
    ConfigModule.forRoot() /**< Loads environment configuration */,
    DetailsModule /**< Manages restaurant details */,
    FoodModule /**< Handles food-related functionality */,
    FoodCategoryModule /**< Manages categories of food */,
    IngredientModule /**< Handles ingredients for the food */,
    LoginModule /**< Manages user authentication */,
    OrdersModule /**< Handles orders and order-related functionality */,
    PermissionModule /**< Manages permissions in the system */,
    PosModule /**< Handles point-of-sale functionality */,
    RestaurantsModule /**< Manages restaurant information */,
    UsersModule /**< Manages users and their information */,
    HealthModule /**< Handles health functionality */,
    TableModule /**< Handles table functionality */,
  ],
  controllers: [AppController] /**< Application controller */,
  providers: [AppService] /**< Core application service */,
})
export class AppModule {}
