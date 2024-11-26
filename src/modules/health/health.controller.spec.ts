import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
  });

  describe('checkHealth', () => {
    it('should return status 200', async () => {
      const result = await healthController.checkHealth();
      expect(result).toEqual(undefined);
    });
  });
});
