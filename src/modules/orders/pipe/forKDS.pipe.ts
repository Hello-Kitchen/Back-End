import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ForKDSPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string') throw new BadRequestException();
    if (value !== 'true' && value !== 'false') throw new BadRequestException();
    return value;
  }
}
