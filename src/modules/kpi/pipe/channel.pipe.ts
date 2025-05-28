import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ChannelPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined) return value;
    if (typeof value !== 'string') throw new BadRequestException();
    if (value !== 'togo' && value !== 'eatin' && value !== 'LAD')
      throw new BadRequestException();
    if (value === 'togo') return 'A emporter';
    if (value === 'eatin') return 'Sur place';
    return value;
  }
}
