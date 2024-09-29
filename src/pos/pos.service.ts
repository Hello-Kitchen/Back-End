import { Injectable } from '@nestjs/common';

@Injectable()
export class PosService {
  Welcome(): string {
    return 'Welcome to the Pos !';
  }
}
