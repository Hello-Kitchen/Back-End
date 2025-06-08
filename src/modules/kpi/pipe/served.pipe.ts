import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ServedPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined) return value;
    if (typeof value !== 'boolean') throw new BadRequestException();
    if (value === false) return undefined;
    return value;
  }
}
