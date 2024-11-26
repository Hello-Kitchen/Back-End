import { HealthController } from './health.controller';
import { HttpStatus } from '@nestjs/common';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(() => {
    healthController = new HealthController();
  });

  describe('checkHealth', () => {
    it('should return status 200 with a healthy message', async () => {
      const result = await healthController.checkHealth();

      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'Server is healthy',
      });
    });
  });
});
