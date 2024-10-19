import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
/**
 * @class JwtStrategy
 * @brief Strategy class that handles JWT validation for authentication.
 * 
 * This class is used to define the strategy for validating JWT tokens using Passport.js in a NestJS application.
 */
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  /**< @brief Extracts the token from the Authorization header */
      ignoreExpiration: false,  /**< @brief Expired tokens are not allowed */
      secretOrKey: 'secret',  /**< @brief Must match the secret defined in `JwtModule.register` */
    });
  }

  /**
   * @brief Validates the JWT payload and returns user information.
   * 
   * @param payload The payload decoded from the JWT token.
   * @return An object containing the user ID and username extracted from the payload.
   * 
   * This method is automatically called by Passport to validate the token and attach user information
   * to the request object.
   */
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };  /**< @brief Returns the user ID and username from the token payload */
  }
}

