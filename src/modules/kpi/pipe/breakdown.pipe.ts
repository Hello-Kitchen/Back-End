import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class BreakdownPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined) return value;
    if (typeof value !== 'boolean') throw new BadRequestException();
    if (value !== true) return undefined;
    return value;
  }
}
