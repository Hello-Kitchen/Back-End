import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class SortPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string')
      throw new BadRequestException();
    if (value !== "time")
        throw new BadRequestException();
    return value;
  }
}