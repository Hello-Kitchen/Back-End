import { Test, TestingModule } from '@nestjs/testing';
import { DetailsController } from './details.controller';
import { DetailsService } from './details.service';
import {
  NotFoundException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { DetailDto } from './DTO/detail.dto';

describe('DetailsController', () => {
  let controller: DetailsController;

  const mockDetailsService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailsController],
      providers: [
        {
          provide: DetailsService,
          useValue: mockDetailsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DetailsController>(DetailsController);
  });

  describe('getAllDetail', () => {
    it('should return all details for a restaurant', async () => {
      const mockDetails = {
        details: [
          { id: 1, name: 'Detail 1' },
          { id: 2, name: 'Detail 2' },
        ],
      };
      mockDetailsService.findAll.mockResolvedValue(mockDetails);

      const result = await controller.getAllDetail(1);
      expect(result).toEqual(mockDetails.details);
      expect(mockDetailsService.findAll).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when no details found', async () => {
      mockDetailsService.findAll.mockResolvedValue({ details: [] });
      await expect(controller.getAllDetail(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockDetailsService.findAll.mockRejectedValue(new Error('Database error'));
      await expect(controller.getAllDetail(1)).rejects.toThrow(HttpException);
    });
  });

  describe('getOneDetail', () => {
    it('should return a single detail', async () => {
      const mockDetail = {
        details: [{ id: 1, name: 'Detail 1' }],
      };
      mockDetailsService.findById.mockResolvedValue(mockDetail);

      const result = await controller.getOneDetail(1, 1);
      expect(result).toEqual(mockDetail.details[0]);
      expect(mockDetailsService.findById).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when detail not found', async () => {
      mockDetailsService.findById.mockResolvedValue(null);
      await expect(controller.getOneDetail(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockDetailsService.findById.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.getOneDetail(1, 1)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('createDetail', () => {
    const createDetailDto: DetailDto = {
      name: 'Updated Detail',
      multiple: true,
      data: [{ name: 'Updated Data', type: 'Updated Type' }],
    };

    it('should create a detail successfully', async () => {
      mockDetailsService.createOne.mockResolvedValue({
        modifiedCount: 1,
        matchedCount: 1,
      });

      await controller.createDetail(1, createDetailDto);
      expect(mockDetailsService.createOne).toHaveBeenCalledWith(
        1,
        createDetailDto,
      );
    });

    it('should throw NotFoundException when restaurant not found', async () => {
      mockDetailsService.createOne.mockResolvedValue({
        modifiedCount: 0,
        matchedCount: 0,
      });

      await expect(controller.createDetail(1, createDetailDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockDetailsService.createOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.createDetail(1, createDetailDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updateOneDetail', () => {
    const updateDetailDto: DetailDto = {
      name: 'Updated Detail',
      multiple: true,
      data: [{ name: 'Updated Data', type: 'Updated Type' }],
    };

    it('should update a detail successfully', async () => {
      mockDetailsService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      await controller.updateOneDetail(1, 1, updateDetailDto);
      expect(mockDetailsService.updateOne).toHaveBeenCalledWith(
        1,
        1,
        updateDetailDto,
      );
    });

    it('should throw NotFoundException when detail not found', async () => {
      mockDetailsService.updateOne.mockResolvedValue({
        matchedCount: 0,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneDetail(1, 1, updateDetailDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no changes made', async () => {
      mockDetailsService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneDetail(1, 1, updateDetailDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle service error', async () => {
      mockDetailsService.updateOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(
        controller.updateOneDetail(1, 1, updateDetailDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteOneDetail', () => {
    it('should delete a detail successfully', async () => {
      mockDetailsService.deleteOne.mockResolvedValue({
        modifiedCount: 1,
      });

      await controller.deleteOneDetail(1, 1);
      expect(mockDetailsService.deleteOne).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when detail not found', async () => {
      mockDetailsService.deleteOne.mockResolvedValue({
        modifiedCount: 0,
      });

      await expect(controller.deleteOneDetail(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockDetailsService.deleteOne.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.deleteOneDetail(1, 1)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
