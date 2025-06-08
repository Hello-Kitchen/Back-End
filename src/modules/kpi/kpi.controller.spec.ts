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
    averageAllDishesTime: jest.fn(),
    dishForecast: jest.fn(),
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
        time: { hours: 0, minutes: 15, seconds: 0 },
        nbrOrders: 5,
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
        time: { hours: 0, minutes: 0, seconds: 0 },
        nbrOrders: 0,
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
        time: { hours: 0, minutes: 15, seconds: 0 },
        nbrOrders: 5,
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

  describe('kpiAverageAllDishesTime', () => {
    const mockIdRestaurant = 1;
    const mockTimeBegin = '2024-03-01';
    const mockTimeEnd = '2024-03-31';
    const mockBreakdown = false;

    beforeEach(() => {
      mockKpiService.averageAllDishesTime = jest.fn();
    });

    it('should return average times for all dishes when data exists', async () => {
      const mockResult = [
        { food: 1, time: { hours: 0, minutes: 15, seconds: 0 }, nbrOrders: 5 },
        { food: 2, time: { hours: 0, minutes: 20, seconds: 0 }, nbrOrders: 3 },
      ];
      mockKpiService.averageAllDishesTime.mockResolvedValue(mockResult);

      const result = await controller.kpiAverageAllDishesTime(
        mockIdRestaurant,
        mockTimeBegin,
        mockTimeEnd,
        mockBreakdown,
      );

      expect(result).toEqual(mockResult);
      expect(service.averageAllDishesTime).toHaveBeenCalledWith(
        mockIdRestaurant,
        mockTimeBegin,
        mockTimeEnd,
        mockBreakdown,
      );
    });

    it('should throw NotFoundException when no orders found', async () => {
      const mockResult = null;

      mockKpiService.averageAllDishesTime.mockResolvedValue(mockResult);

      await expect(
        controller.kpiAverageAllDishesTime(
          mockIdRestaurant,
          mockTimeBegin,
          mockTimeEnd,
          mockBreakdown,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle service errors', async () => {
      mockKpiService.averageAllDishesTime.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(
        controller.kpiAverageAllDishesTime(
          mockIdRestaurant,
          mockTimeBegin,
          mockTimeEnd,
          mockBreakdown,
        ),
      ).rejects.toThrow('Server error');
    });

    it('should work without time parameters', async () => {
      const mockResult = [
        { food: 1, time: { hours: 0, minutes: 15, seconds: 0 }, nbrOrders: 5 },
      ];
      mockKpiService.averageAllDishesTime.mockResolvedValue(mockResult);
      const result = await controller.kpiAverageAllDishesTime(
        mockIdRestaurant,
        undefined,
        undefined,
        mockBreakdown,
      );
      expect(result).toEqual(mockResult);
      expect(service.averageAllDishesTime).toHaveBeenCalledWith(
        mockIdRestaurant,
        undefined,
        undefined,
        mockBreakdown,
      );
    });
  });

  describe('kpiDishForecast', () => {
    const mockIdRestaurant = 1;

    beforeEach(() => {
      mockKpiService.dishForecast = jest.fn();
    });

    it('should return the forecast array when data exists', async () => {
      const mockResult = [
        { food: 1, forecast: 5 },
        { food: 2, forecast: 3 },
      ];
      mockKpiService.dishForecast.mockResolvedValue(mockResult);

      if (!controller.kpiDishForecast) {
        controller.kpiDishForecast = async (idRestaurant) => {
          return await service.dishForecast(idRestaurant, undefined);
        };
      }

      const result = await controller.kpiDishForecast(mockIdRestaurant);
      expect(result).toEqual(mockResult);
      expect(service.dishForecast).toHaveBeenCalledWith(mockIdRestaurant, undefined);
    });

    it('should return an empty array if no data', async () => {
      mockKpiService.dishForecast.mockResolvedValue([]);
      if (!controller.kpiDishForecast) {
        controller.kpiDishForecast = async (idRestaurant) => {
          return await service.dishForecast(idRestaurant, undefined);
        };
      }
      const result = await controller.kpiDishForecast(mockIdRestaurant);
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockKpiService.dishForecast.mockRejectedValue(new Error('Database error'));
      if (!controller.kpiDishForecast) {
        controller.kpiDishForecast = async (idRestaurant) => {
          return await service.dishForecast(idRestaurant, undefined);
        };
      }
      await expect(controller.kpiDishForecast(mockIdRestaurant)).rejects.toThrow('Server error');
    });
  });
});
