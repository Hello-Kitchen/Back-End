import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DB } from '../../db/db';
import { User } from '../users/schemas/users.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
/**
 * @class LoginService
 * @brief Service that handles user authentication and JWT generation.
 *
 * The LoginService is responsible for verifying user credentials (username and password)
 * and generating JWT tokens upon successful authentication.
 */
export class LoginService extends DB {
  constructor(private jwtService: JwtService) {
    super();
  }

  /**
   * @brief Authenticates a user by verifying their username and password.
   *
   * @param idRestaurant The restaurant ID where the user is working.
   * @param username The username of the user attempting to log in.
   * @param password The password provided by the user.
   * @returns {Promise<string>} A success message if authentication is successful.
   * @throws {UnauthorizedException} If the user is not found or the password is incorrect.
   *
   * This method retrieves the user from the database, hashes the provided password,
   * and compares it with the stored hashed password. If the credentials match,
   * the user is authenticated.
   */
  async authenticateUser(
    idRestaurant: number,
    username: string,
    password: string,
  ): Promise<User> {
    const db = this.getDbConnection();

    // Retrieve the user from the database based on the username
    const user = await db.collection('restaurant').findOne(
      { id: idRestaurant },
      {
        projection: { _id: 0, users: { $elemMatch: { username: username } } },
      },
    );

    if (!user) {
      // Throw an error if the user does not exist
      throw new BadRequestException();
    }

    const hashedPassword = bcrypt.hashSync(
      password,
      `${process.env.SALT_HASH}`,
    );

    // Compare the hashed password with the stored password
    if (hashedPassword !== user.users[0].password) {
      // Throw an error if the password does not match
      throw new BadRequestException();
    }

    return user.users[0]; // Return the authenticated user if successful
  }

  /**
   * @brief Logs in a user by generating a JWT token.
   *
   * @param user The user object containing username and ID.
   * @returns {Promise<object>} An object containing the generated access token.
   *
   * This method generates a JWT token using the user's username and ID and
   * returns it as part of the login process.
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload), // Generates the JWT token
    };
  }
}
