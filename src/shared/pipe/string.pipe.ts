import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class StringPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string') {
      throw new BadRequestException();
    }
    return value;
  }
}
