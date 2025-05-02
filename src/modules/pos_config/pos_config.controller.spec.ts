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
    findOne: jest.fn(),
    updateOne: jest.fn(),
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

  describe('getPosConfig', () => {
    it('should return the pos_config of a restaurant', async () => {
      const mockConfig = {
        tables: [
          {
            id: 0,
            x: 0,
            y: 0,
            name: '0',
            type: 'circle',
            plates: 2,
            time: '00:00',
          },
          {
            id: 1,
            x: 500,
            y: 500,
            name: '1',
            type: 'rectangle',
            plates: 4,
            time: '00:00',
          },
        ],
        width: 1920,
        height: 1080,
      };
      mockPosConfigService.findOne.mockResolvedValue({
        pos_config: mockConfig,
      });

      const result = await controller.getPosConfig(1);
      expect(result).toEqual(mockConfig);
      expect(mockPosConfigService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if config not found', async () => {
      mockPosConfigService.findOne.mockResolvedValue(null);

      await expect(controller.getPosConfig(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockPosConfigService.findOne.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.getPosConfig(1)).rejects.toThrow(HttpException);
    });
  });

  describe('updatePosConfig', () => {
    const updateDto: PosConfigDto = {
      tables: [
        {
          id: 0,
          x: 0,
          y: 0,
          name: '0',
          type: 'circle',
          plates: 2,
          time: '00:00',
        },
        {
          id: 1,
          x: 500,
          y: 500,
          name: '1',
          type: 'rectangle',
          plates: 4,
          time: '00:00',
        },
      ],
      width: 1920,
      height: 1080,
    };

    it('should update the pos_config successfully', async () => {
      mockPosConfigService.updateOne.mockResolvedValue({ modifiedCount: 1 });

      const result = await controller.updatePosConfig(1, updateDto);
      expect(result).toEqual(true);
      expect(mockPosConfigService.updateOne).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw BadRequestException if no changes made', async () => {
      mockPosConfigService.updateOne.mockResolvedValue({ modifiedCount: 0 });
      await expect(controller.updatePosConfig(1, updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle service error', async () => {
      mockPosConfigService.updateOne.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.updatePosConfig(1, updateDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
