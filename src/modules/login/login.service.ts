import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DB } from 'src/db/db';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService extends DB {
  /**
   * Authenticates a user by verifying their username and password.
   * 
   * @param {string} username - The username of the user attempting to log in.
   * @param {string} password - The password provided by the user.
   * @returns {Promise<string>} A success message if authentication is successful.
   * @throws {UnauthorizedException} If the user is not found or the password is incorrect.
   */
  async authenticateUser(username: string, password: string): Promise<string> {
    const db = this.getDbConnection();
    
    // Retrieve the user from the database based on the username
    const user = await db.collection('user').findOne({ username });

    if (!user) {
      // Throw an error if the user does not exist
      throw new UnauthorizedException('USER NOT FOUND');
    }

    // Hash the provided password using bcrypt
    password = bcrypt.hashSync(password, process.env.SALT_HASH);

    // Compare the hashed password with the stored password
    if (password !== user.password) {
      // Throw an error if the password does not match
      throw new UnauthorizedException('WRONG PASSWORD');
    }

    return 'OK'; // Return success message if authentication is successful
  }
}
