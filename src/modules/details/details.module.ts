import { Module } from '@nestjs/common';
import { DetailsController } from './details.controller';
import { DetailsService } from './details.service';

@Module({
  imports: [],
  controllers: [DetailsController],
  providers: [DetailsService],
})
export class DetailsModule {}
