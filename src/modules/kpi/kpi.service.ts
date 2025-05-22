import { Injectable } from '@nestjs/common';
import { DB } from '../../db/db';

@Injectable()
export class KpiService extends DB {
  /**
   * Formats average time into a readable structure with value and unit
   * @param minutes - The time in minutes to format
   * @returns An object containing the formatted value and appropriate time unit
   * @example
   * formatAverageTime(0.5) // returns { value: 30, unit: 'seconds' }
   * formatAverageTime(45) // returns { value: 45, unit: 'minutes' }
   * formatAverageTime(90) // returns { value: 1.5, unit: 'hours' }
   */
  private formatAverageTime(minutes: number): { value: number; unit: string } {
    minutes = minutes * -1;
    if (minutes < 1) {
      return {
        value: Math.round(minutes * 60),
        unit: 'seconds',
      };
    } else if (minutes < 60) {
      return {
        value: Math.round(minutes),
        unit: 'minutes',
      };
    } else {
      const hours = minutes / 60;
      return {
        value: Number(hours.toFixed(1)),
        unit: 'hours',
      };
    }
  }

  /**
   * Calculates the average preparation time for a specific dish in a restaurant
   * @param idRestaurant - The restaurant identifier
   * @param timeBegin - Start date of the analysis period (optional)
   * @param timeEnd - End date of the analysis period (optional)
   * @param food - The dish identifier to analyze
   * @returns An object containing the formatted average time and total number of orders
   * @example
   * averageDishTime(1, '2024-01-01', '2024-01-31', 123)
   * // returns { formattedTime: { value: 15, unit: 'minutes' }, totalOrders: 50 }
   */
  async averageDishTime(
    idRestaurant: number,
    timeBegin: string,
    timeEnd: string,
    food: number,
  ) {
    const db = this.getDbConnection();
    const preparationTimes = [];

    let result = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $unwind: '$orders' },
        {
          $match: {
            'orders.food_ordered.food': food,
          },
        },
        {
          $project: { 'orders.date': 1, 'orders.food_ordered.timeReady': 1, _id: 0 },
        },
      ])
      .toArray();

    if (timeBegin && timeEnd) {
      const beginDate = new Date(timeBegin);
      const endDate = new Date(timeEnd);
      result = result.filter((item) => {
        const orderDate = new Date(item.orders.date);
        return orderDate >= beginDate && orderDate <= endDate;
      });
    }

    result.map((item) => {
      const orderDate = new Date(item.orders.date);

      item.orders.food_ordered.map((food) => {
        const preparationTime = new Date(food.timeReady);
        const timeDiff = orderDate.getTime() - preparationTime.getTime();
        preparationTimes.push(timeDiff / (1000 * 60));
      });
    });

    const averageTime =
      preparationTimes.length > 0
        ? preparationTimes.reduce((acc, time) => acc + time, 0) /
          preparationTimes.length
        : 0;

    const totalSeconds = Math.round(averageTime * 60) * -1;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      time: {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      },
      nbrOrders: preparationTimes.length,
    };
  }
}
