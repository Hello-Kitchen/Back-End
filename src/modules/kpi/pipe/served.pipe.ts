import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ServedPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined) return value;
    if (typeof value !== 'boolean') throw new BadRequestException();
    return value;
  }
}
