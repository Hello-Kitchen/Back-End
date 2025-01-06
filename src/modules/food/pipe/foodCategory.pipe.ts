import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FoodCategoryPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined || isNaN(value)) return -1;
    const numberValue = Number(value);
    if (isNaN(numberValue) || numberValue < 0) throw new BadRequestException();
    return numberValue;
  }
}
