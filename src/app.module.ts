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

@Module({
  imports: [
    ConfigModule.forRoot(),
    DetailsModule,
    FoodModule,
    FoodCategoryModule,
    IngredientModule,
    LoginModule,
    OrdersModule,
    PermissionModule,
    PosModule,
    RestaurantsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
