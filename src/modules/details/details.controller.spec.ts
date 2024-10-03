import { Test, TestingModule } from '@nestjs/testing';
import { DetailsController } from './details.controller';
import { DetailsService } from './details.service';

describe('AppController', () => {
  let detailsController: DetailsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DetailsController],
      providers: [DetailsService],
    }).compile();

    detailsController = app.get<DetailsController>(DetailsService);
  });
});
