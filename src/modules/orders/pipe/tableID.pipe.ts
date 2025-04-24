import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TableIDPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined) return value;
    if (typeof value !== 'number') throw new BadRequestException();
    return value;
  }
}
