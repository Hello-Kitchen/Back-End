import { Test, TestingModule } from '@nestjs/testing';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

describe('PermissionController', () => {
  let permissionController: PermissionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [PermissionService],
    }).compile();

    permissionController = app.get<PermissionController>(PermissionController);
  });

  describe('root', () => {
    it('should return "Welcome to the Permission !"', () => {
      expect(permissionController.Welcome()).toBe(
        'Welcome to the Permission !',
      );
    });
  });
});
