import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ChannelPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined) throw new BadRequestException();
    if (typeof value !== 'string') throw new BadRequestException();
    if (value !== 'togo' && value !== 'eatin')
      throw new BadRequestException();
    return value;
  }
}
