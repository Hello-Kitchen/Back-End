import { Controller, Get } from '@nestjs/common';
import { PosService } from './pos.service';

@Controller('api/pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Get()
  Welcome(): string {
    return this.posService.Welcome();
  }
}
