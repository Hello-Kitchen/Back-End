import { Test, TestingModule } from '@nestjs/testing';
import { BackOfficeLoginController } from './back_office_login.controller';
import { BackOfficeLoginService } from './back_office_login.service';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('LoginController', () => {
  let controller: BackOfficeLoginController;

  const mockLoginService = {
    authenticateUser: jest.fn(),
    login: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackOfficeLoginController],
      providers: [
        {
          provide: BackOfficeLoginService,
          useValue: mockLoginService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<BackOfficeLoginController>(BackOfficeLoginController);
  });

  describe('login', () => {
    const loginCredentials = {
      username: 'testuser',
      password: 'testpass',
    };

    const mockUser = {
      username: 'testuser',
      role: 'user',
    };

    const mockToken = {
      access_token: 'mock.jwt.token',
    };

    it('should successfully authenticate and return a token', async () => {
      mockLoginService.authenticateUser.mockResolvedValue(mockUser);
      mockLoginService.login.mockResolvedValue(mockToken);

      const result = await controller.login(
        loginCredentials.password,
        loginCredentials.username,
      );

      expect(mockLoginService.authenticateUser).toHaveBeenCalledWith(
        loginCredentials.username,
        loginCredentials.password,
      );

      expect(mockLoginService.login).toHaveBeenCalledWith(mockUser);

      expect(result).toEqual(mockToken);
    });

    it('should throw BadRequestException when authentication fails', async () => {
      mockLoginService.authenticateUser.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        controller.login(
          loginCredentials.password,
          loginCredentials.username,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when token generation fails', async () => {
      mockLoginService.authenticateUser.mockResolvedValue(mockUser);
      mockLoginService.login.mockRejectedValue(
        new Error('Token generation failed'),
      );

      await expect(
        controller.login(
          loginCredentials.password,
          loginCredentials.username,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
