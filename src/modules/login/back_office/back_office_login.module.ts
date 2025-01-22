import { Module } from '@nestjs/common';
import { BackOfficeLoginController } from './back_office_login.controller';
import { BackOfficeLoginService } from './back_office_login.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../jwt.strategy';
import { PassportModule } from '@nestjs/passport';

/**
 * Module for managing login items in the restaurant.
 *
 * The `BackOfficeLoginModule` encapsulates the `BackOfficeLoginController` and `BackOfficeLoginService`
 * to handle operations related to login to back-office.
 *
 * @module BackOfficeLoginModule
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
    BackOfficeLoginController /**< The controller responsible for handling HTTP requests related to login items */,
  ],
  providers: [
    BackOfficeLoginService /**< The service that contains the business logic for managing login items */,
    JwtStrategy,
  ],
  exports: [JwtModule, PassportModule],
})
export class BackOfficeLoginModule {}
