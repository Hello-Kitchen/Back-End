import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class StatusPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string') throw new BadRequestException();
    if (value !== 'pending' && value !== 'ready')
      throw new BadRequestException();
    return value;
  }
}
