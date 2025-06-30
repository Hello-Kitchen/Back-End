import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UseCasePipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined) return value;
    if (typeof value !== 'string') throw new BadRequestException();
    if (value !== 'POS' && value !== 'KDS' && value !== 'statsPOS')
      return undefined;
    return value;
  }
}
