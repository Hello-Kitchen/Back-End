import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('LoginController', () => {
  let controller: LoginController;

  const mockLoginService = {
    authenticateUser: jest.fn(),
    login: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: mockLoginService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });

  describe('login', () => {
    const loginCredentials = {
      username: 'testuser',
      password: 'testpass',
      idRestaurant: 1,
    };

    const mockUser = {
      id: 1,
      username: 'testuser',
      role: 'user',
      firstname: 'Test',
      lastname: 'User',
    };

    const mockToken = {
      access_token: 'mock.jwt.token',
      id: 1,
      firstname: 'Test',
      lastname: 'User',
    };

    it('should successfully authenticate and return a token', async () => {
      mockLoginService.authenticateUser.mockResolvedValue(mockUser);
      mockLoginService.login.mockResolvedValue(mockToken);

      const result = await controller.login(
        loginCredentials.password,
        loginCredentials.username,
        loginCredentials.idRestaurant,
      );

      expect(mockLoginService.authenticateUser).toHaveBeenCalledWith(
        loginCredentials.idRestaurant,
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
          loginCredentials.idRestaurant,
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
          loginCredentials.idRestaurant,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
