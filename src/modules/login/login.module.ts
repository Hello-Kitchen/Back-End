import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

/**
 * Module for managing login items in the restaurant.
 *
 * The `LoginModule` encapsulates the `LoginController` and `LoginService`
 * to handle operations related to login items, including
 * creating, reading, updating, and deleting login items.
 *
 * @module LoginModule
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' }, // life of the token
      secret: 'secret',
    }),
  ],
  controllers: [
    LoginController /**< The controller responsible for handling HTTP requests related to login items */,
  ],
  providers: [
    LoginService /**< The service that contains the business logic for managing login items */,
    JwtStrategy,
  ],
  exports: [JwtModule, PassportModule],
})
export class LoginModule {}
