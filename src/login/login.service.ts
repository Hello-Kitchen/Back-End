import { Injectable, UnauthorizedException } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult } from 'mongodb';
import { DB } from 'src/db/db';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService extends DB {

  async authenticateUser(username: string, password: string): Promise<string> {
    const db = this.getDbConnection();
    const user = await db.collection('user').findOne({ username });

    if (!user) {
      throw new UnauthorizedException('USER NOT FOUND');
    }

    password = bcrypt.hashSync(password, process.env.SALT_HASH)

    if (password !== user.password) {
      throw new UnauthorizedException('WRONG PASSWORD');
    }

    return 'OK';
  }
}
