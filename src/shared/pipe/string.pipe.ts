import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class StringPipe implements PipeTransform {
  transform(value: any) {
    console.log(`value = ${value} && typeof = ${typeof value}`)
    if (typeof value !== 'string') {
      throw new BadRequestException();
    }
    return value;
  }
}