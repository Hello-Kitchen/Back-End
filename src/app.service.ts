import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  Welcome(): string {
    return 'Welcome to the API !';
  }
}
