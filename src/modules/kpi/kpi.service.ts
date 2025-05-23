import { Injectable } from '@nestjs/common';
import { DB } from '../../db/db';

@Injectable()
export class KpiService extends DB {
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
            'orders.food_ordered.is_ready': true,
          },
        },
        {
          $project: {
            'orders.date': 1,
            'orders.food_ordered.timeReady': 1,
            _id: 0,
          },
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

  /**
   * Calculates the average preparation time for all dishes in a restaurant
   * @param idRestaurant - The restaurant identifier
   * @param timeBegin - Start date of the analysis period (optional)
   * @param timeEnd - End date of the analysis period (optional)
   * @returns Array of objects: { food, time, nbrOrders }
   */
  async averageAllDishesTime(
    idRestaurant: number,
    timeBegin?: string,
    timeEnd?: string,
  ) {
    const db = this.getDbConnection();
    let result = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $unwind: '$orders' },
        { $unwind: '$orders.food_ordered' },
        {
          $project: {
            'orders.date': 1,
            'orders.food_ordered.food': 1,
            'orders.food_ordered.timeReady': 1,
            _id: 0,
          },
        },
      ])
      .toArray();

    console.log(result);
    if (timeBegin && timeEnd) {
      const beginDate = new Date(timeBegin);
      const endDate = new Date(timeEnd);
      result = result.filter((item) => {
        const orderDate = new Date(item.orders.date);
        return orderDate >= beginDate && orderDate <= endDate;
      });
    }

    const dishMap = new Map();
    result.forEach((item) => {
      const food = item.orders.food_ordered.food;
      const orderDate = new Date(item.orders.date);
      const preparationTime = new Date(item.orders.food_ordered.timeReady);
      const timeDiff = orderDate.getTime() - preparationTime.getTime();
      const minutes = timeDiff / (1000 * 60);
      if (!dishMap.has(food)) {
        dishMap.set(food, []);
      }
      dishMap.get(food).push(minutes);
    });

    const resultArray = [];
    for (const [food, times] of dishMap.entries()) {
      const averageTime =
        times.length > 0
          ? times.reduce((acc, t) => acc + t, 0) / times.length
          : 0;
      const totalSeconds = Math.round(averageTime * 60);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      resultArray.push({
        food,
        time: { hours, minutes, seconds },
        nbrOrders: times.length,
      });
    }
    return resultArray;
  }
}
