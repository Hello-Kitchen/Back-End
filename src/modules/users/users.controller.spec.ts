import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  NotFoundException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { UsersDto } from './DTO/users.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    createOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    updatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('getAllUser', () => {
    it('should return all users without passwords', async () => {
      const mockUsers = {
        users: [
          {
            id: 1,
            username: 'user1',
            password: 'pass1',
            firstname: 'first1',
            lastname: 'last1',
          },
          {
            id: 2,
            username: 'user2',
            password: 'pass2',
            firstname: 'first2',
            lastname: 'last2',
          },
        ],
      };
      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.getAllUser(1);
      expect(result).toEqual([
        { id: 1, username: 'user1', firstname: 'first1', lastname: 'last1' },
        { id: 2, username: 'user2', firstname: 'first2', lastname: 'last2' },
      ]);
      expect(mockUsersService.findAll).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when no users found', async () => {
      mockUsersService.findAll.mockResolvedValue(null);
      await expect(controller.getAllUser(1)).rejects.toThrow(NotFoundException);
    });

    it('should handle service error', async () => {
      mockUsersService.findAll.mockRejectedValue(new Error('Database error'));
      await expect(controller.getAllUser(1)).rejects.toThrow(HttpException);
    });
  });

  describe('getOneUser', () => {
    it('should return a single user', async () => {
      const mockUser = {
        id: 1,
        username: 'user1',
        firstname: 'first1',
        lastname: 'last1',
      };
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.getOneUser(1, 1);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findById).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);
      await expect(controller.getOneUser(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockUsersService.findById.mockRejectedValue(new Error('Database error'));
      await expect(controller.getOneUser(1, 1)).rejects.toThrow(HttpException);
    });
  });

  describe('createUser', () => {
    const createUserDto: UsersDto = {
      username: 'newuser',
      password: 'password123',
      firstname: 'first',
      lastname: 'last',
    };

    it('should create user successfully', async () => {
      const mockResult = {
        modifiedCount: 1,
        matchedCount: 1,
      };
      mockUsersService.createOne.mockResolvedValue(mockResult);

      const result = await controller.createUser(1, createUserDto);
      expect(result).toEqual(mockResult);
      expect(mockUsersService.createOne).toHaveBeenCalledWith(1, createUserDto);
    });

    it('should throw BadRequestException when creation fails', async () => {
      mockUsersService.createOne.mockResolvedValue(null);
      await expect(controller.createUser(1, createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle service error', async () => {
      mockUsersService.createOne.mockRejectedValue(new Error('Database error'));
      await expect(controller.createUser(1, createUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updateOneUser', () => {
    const updateUserDto: UsersDto = {
      username: 'updateduser',
      password: 'newpassword123',
      firstname: 'newfirst',
      lastname: 'newlast',
    };

    it('should update user successfully', async () => {
      mockUsersService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      await controller.updateOneUser(1, 1, updateUserDto);
      expect(mockUsersService.updateOne).toHaveBeenCalledWith(
        1,
        1,
        updateUserDto,
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUsersService.updateOne.mockResolvedValue({
        matchedCount: 0,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneUser(1, 1, updateUserDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle service error', async () => {
      mockUsersService.updateOne.mockRejectedValue(new Error('Database error'));
      await expect(
        controller.updateOneUser(1, 1, updateUserDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteOneUser', () => {
    it('should delete user successfully', async () => {
      mockUsersService.deleteOne.mockResolvedValue({
        modifiedCount: 1,
      });

      await controller.deleteOneUser(1, 1);
      expect(mockUsersService.deleteOne).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUsersService.deleteOne.mockResolvedValue({
        modifiedCount: 0,
      });

      await expect(controller.deleteOneUser(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockUsersService.deleteOne.mockRejectedValue(new Error('Database error'));
      await expect(controller.deleteOneUser(1, 1)).rejects.toThrow(
        HttpException,
      );
    });

    describe('updatePassword', () => {
      const updatePasswordDto = {
        oldPassword: 'oldpassword123',
        newPassword: 'newpassword123',
      };

      it('should update the password successfully', async () => {
        const mockResponse = { status: 200 };
        mockUsersService.updatePassword.mockResolvedValue(mockResponse);

        await controller.updatePassword(1, 1, updatePasswordDto);
        expect(mockUsersService.updatePassword).toHaveBeenCalledWith(
          1,
          1,
          updatePasswordDto,
        );
      });

      it('should throw NotFoundException if user is not found', async () => {
        mockUsersService.updatePassword.mockResolvedValue(null);

        await expect(
          controller.updatePassword(1, 1, updatePasswordDto),
        ).rejects.toThrow(NotFoundException);
      });

      it('should handle service error', async () => {
        mockUsersService.updatePassword.mockRejectedValue(
          new Error('Database error'),
        );

        await expect(
          controller.updatePassword(1, 1, updatePasswordDto),
        ).rejects.toThrow(HttpException);
      });
    });
  });
});
