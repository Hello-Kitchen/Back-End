import { Test, TestingModule } from '@nestjs/testing';
import { PosConfigController } from './pos_config.controller';
import { PosConfigService } from './pos_config.service';
import {
  NotFoundException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PosConfigDto } from './DTO/pos_config.dto';

describe('PosConfigController', () => {
  let controller: PosConfigController;

  const mockPosConfigService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PosConfigController],
      providers: [
        {
          provide: PosConfigService,
          useValue: mockPosConfigService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PosConfigController>(PosConfigController);
  });

  describe('getAllPosConfig', () => {
    it('should return all pos_configs', async () => {
      const mockPosConfig = [
        { id: 1, name: 'PosConfig 1' },
        { id: 2, name: 'PosConfig 2' },
      ];
      mockPosConfigService.findAll.mockResolvedValue(mockPosConfig);

      const result = await controller.getAllPosConfig();
      expect(result).toEqual(mockPosConfig);
    });

    it('should throw NotFoundException when no pos_configs found', async () => {
      mockPosConfigService.findAll.mockResolvedValue([]);
      await expect(controller.getAllPosConfig()).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockPosConfigService.findAll.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.getAllPosConfig()).rejects.toThrow(HttpException);
    });
  });

  describe('getOnePosConfig', () => {
    it('should return a single pos_config', async () => {
      const mockPosConfig = { id: 1, name: 'PosConfig 1' };
      mockPosConfigService.findById.mockResolvedValue(mockPosConfig);

      const result = await controller.getOnePosConfig(1);
      expect(result).toEqual(mockPosConfig);
    });

    it('should throw NotFoundException when pos_config not found', async () => {
      mockPosConfigService.findById.mockResolvedValue(null);
      await expect(controller.getOnePosConfig(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockPosConfigService.findById.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.getOnePosConfig(1)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('createPosConfig', () => {
    const createPosConfigDto: PosConfigDto = {
      location: 'location',
      tables: [],
      width: 0,
      height: 0,
    };

    it('should create pos_config successfully', async () => {
      const mockCreatedPosConfig = {
        insertedId: 'some-id',
        acknowledged: true,
      };
      mockPosConfigService.createOne.mockResolvedValue(mockCreatedPosConfig);

      const result = await controller.createPosConfig(createPosConfigDto);
      expect(result).toEqual(mockCreatedPosConfig);
    });

    it('should throw BadRequestException when creation fails', async () => {
      mockPosConfigService.createOne.mockResolvedValue(null);
      await expect(
        controller.createPosConfig(createPosConfigDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle service error', async () => {
      mockPosConfigService.createOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(
        controller.createPosConfig(createPosConfigDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateOnePosConfig', () => {
    const updatePosConfigDto: PosConfigDto = {
      location: 'location',
      tables: [],
      width: 0,
      height: 0,
    };

    it('should update pos_config successfully', async () => {
      mockPosConfigService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      await controller.updateOnePosConfig(1, updatePosConfigDto);
      expect(mockPosConfigService.updateOne).toHaveBeenCalledWith(
        1,
        updatePosConfigDto,
      );
    });

    it('should throw NotFoundException when pos_config not found', async () => {
      mockPosConfigService.updateOne.mockResolvedValue({
        matchedCount: 0,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOnePosConfig(1, updatePosConfigDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no changes made', async () => {
      mockPosConfigService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOnePosConfig(1, updatePosConfigDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle service error', async () => {
      mockPosConfigService.updateOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(
        controller.updateOnePosConfig(1, updatePosConfigDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteOnePosConfig', () => {
    it('should delete pos_config successfully', async () => {
      mockPosConfigService.deleteOne.mockResolvedValue({
        deletedCount: 1,
      });

      await controller.deleteOnePosConfig(1);
      expect(mockPosConfigService.deleteOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when pos_config not found', async () => {
      mockPosConfigService.deleteOne.mockResolvedValue({
        deletedCount: 0,
      });

      await expect(controller.deleteOnePosConfig(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockPosConfigService.deleteOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.deleteOnePosConfig(1)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
