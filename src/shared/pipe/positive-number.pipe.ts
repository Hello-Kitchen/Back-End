import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PositiveNumberPipe implements PipeTransform {
  transform(value: any) {
    const numberValue = Number(value);
    if (isNaN(numberValue) || numberValue < 0) {
      throw new BadRequestException();
    }
    return numberValue;
  }
}
