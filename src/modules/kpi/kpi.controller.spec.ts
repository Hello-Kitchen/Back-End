import { Test, TestingModule } from '@nestjs/testing';
import { KpiController } from './kpi.controller';
import { KpiService } from './kpi.service';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

describe('KpiController', () => {
  let controller: KpiController;
  let service: KpiService;

  const mockKpiService = {
    averageDishTime: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KpiController],
      providers: [
        {
          provide: KpiService,
          useValue: mockKpiService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<KpiController>(KpiController);
    service = module.get<KpiService>(KpiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('kpiAverageDishTime', () => {
    const mockIdRestaurant = 1;
    const mockFood = 1;
    const mockTimeBegin = '2024-03-01';
    const mockTimeEnd = '2024-03-31';

    it('should return average dish time when data exists', async () => {
      const mockResult = {
        formattedTime: { value: 15, unit: 'minutes' },
        totalOrders: 5,
      };

      mockKpiService.averageDishTime.mockResolvedValue(mockResult);

      const result = await controller.kpiAverageDishTime(
        mockIdRestaurant,
        mockTimeBegin,
        mockTimeEnd,
        mockFood,
      );

      expect(result).toEqual(mockResult);
      expect(service.averageDishTime).toHaveBeenCalledWith(
        mockIdRestaurant,
        mockTimeBegin,
        mockTimeEnd,
        mockFood,
      );
    });

    it('should throw NotFoundException when no orders found', async () => {
      const mockResult = {
        formattedTime: { value: 0, unit: 'minutes' },
        totalOrders: 0,
      };

      mockKpiService.averageDishTime.mockResolvedValue(mockResult);

      await expect(
        controller.kpiAverageDishTime(
          mockIdRestaurant,
          mockTimeBegin,
          mockTimeEnd,
          mockFood,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle service errors', async () => {
      mockKpiService.averageDishTime.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        controller.kpiAverageDishTime(
          mockIdRestaurant,
          mockTimeBegin,
          mockTimeEnd,
          mockFood,
        ),
      ).rejects.toThrow('Server error');
    });

    it('should work without time parameters', async () => {
      const mockResult = {
        formattedTime: { value: 15, unit: 'minutes' },
        totalOrders: 5,
      };

      mockKpiService.averageDishTime.mockResolvedValue(mockResult);

      const result = await controller.kpiAverageDishTime(
        mockIdRestaurant,
        undefined,
        undefined,
        mockFood,
      );

      expect(result).toEqual(mockResult);
      expect(service.averageDishTime).toHaveBeenCalledWith(
        mockIdRestaurant,
        undefined,
        undefined,
        mockFood,
      );
    });
  });
});
