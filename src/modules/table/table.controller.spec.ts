import { Test, TestingModule } from '@nestjs/testing';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { TableDto } from './DTO/table.dto';
import {
  NotFoundException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

describe('TableController', () => {
  let controller: TableController;

  const mockTableService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TableController],
      providers: [
        {
          provide: TableService,
          useValue: mockTableService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TableController>(TableController);
  });

  describe('getAllTable', () => {
    it('should return all Tables', async () => {
      const mockTables = {
        tables: [
          {
            id: 1,
            x: 0,
            y: 0,
            name: 'name',
            type: 'circle',
            plates: 2,
            time: '00:00',
          },
          {
            id: 1,
            x: 0,
            y: 0,
            name: 'name',
            type: 'rectangle',
            plates: 4,
            time: '00:00',
          },
        ],
      };
      mockTableService.findAll.mockResolvedValue(mockTables);

      const result = await controller.getAllTable(1);
      expect(result).toEqual(mockTables.tables);
      expect(mockTableService.findAll).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when no tables found', async () => {
      mockTableService.findAll.mockResolvedValue(null);
      await expect(controller.getAllTable(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockTableService.findAll.mockRejectedValue(new Error('Database error'));
      await expect(controller.getAllTable(1)).rejects.toThrow(HttpException);
    });
  });

  describe('getOneTable', () => {
    it('should return a single table', async () => {
      const mockTable = {
        tables: [
          {
            id: 1,
            x: 0,
            y: 0,
            name: 'name',
            type: 'square',
            plates: 2,
            time: '00:00',
          },
        ],
      };
      mockTableService.findById.mockResolvedValue(mockTable);

      const result = await controller.getOneTable(1, 1);
      expect(result).toEqual(mockTable.tables[0]);
      expect(mockTableService.findById).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when table not found', async () => {
      mockTableService.findById.mockResolvedValue(null);
      await expect(controller.getOneTable(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockTableService.findById.mockRejectedValue(new Error('Database error'));
      await expect(controller.getOneTable(1, 1)).rejects.toThrow(HttpException);
    });
  });

  describe('createTable', () => {
    const mockTable: TableDto = {
      id: 1,
      x: 0,
      y: 0,
      name: 'table',
      type: 'square',
      plates: 2,
      time: '00:00',
    };

    it('should create an table successfully', async () => {
      mockTableService.createOne.mockResolvedValue({
        modifiedCount: 1,
        matchedCount: 1,
      });

      await controller.createTable(1, mockTable);
      expect(mockTableService.createOne).toHaveBeenCalledWith(1, mockTable);
    });

    it('should throw NotFoundException when restaurant not found', async () => {
      mockTableService.createOne.mockResolvedValue({
        modifiedCount: 0,
        matchedCount: 0,
      });

      await expect(controller.createTable(1, mockTable)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockTableService.createOne.mockRejectedValue(new Error('Database error'));
      await expect(controller.createTable(1, mockTable)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updateOneTable', () => {
    const updateTableDto: TableDto = {
      id: 1,
      x: 0,
      y: 0,
      name: 'table',
      type: 'square',
      plates: 2,
      time: '00:00',
    };

    it('should update an table successfully', async () => {
      mockTableService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      await controller.updateOneTable(1, 1, updateTableDto);
      expect(mockTableService.updateOne).toHaveBeenCalledWith(
        1,
        1,
        updateTableDto,
      );
    });

    it('should throw NotFoundException when table not found', async () => {
      mockTableService.updateOne.mockResolvedValue({
        matchedCount: 0,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneTable(1, 1, updateTableDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no changes made', async () => {
      mockTableService.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 0,
      });

      await expect(
        controller.updateOneTable(1, 1, updateTableDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle service error', async () => {
      mockTableService.updateOne.mockRejectedValue(new Error('Database error'));
      await expect(
        controller.updateOneTable(1, 1, updateTableDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteOnetable', () => {
    it('should delete an table successfully', async () => {
      mockTableService.deleteOne.mockResolvedValue({
        modifiedCount: 1,
      });

      await controller.deleteOneTable(1, 1);
      expect(mockTableService.deleteOne).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException when table not found', async () => {
      mockTableService.deleteOne.mockResolvedValue({
        modifiedCount: 0,
      });

      await expect(controller.deleteOneTable(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle service error', async () => {
      mockTableService.deleteOne.mockRejectedValue(new Error('Database error'));
      await expect(controller.deleteOneTable(1, 1)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
