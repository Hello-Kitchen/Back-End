import { Test, TestingModule } from '@nestjs/testing';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';

describe('PosController', () => {
  let posController: PosController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PosController],
      providers: [PosService],
    }).compile();

    posController = app.get<PosController>(PosController);
  });

  describe('root', () => {
    it('should return "Welcome to the Pos !"', () => {
      expect(posController.Welcome()).toBe('Welcome to the Pos !');
    });
  });
});
