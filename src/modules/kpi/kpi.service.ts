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
   * @param breakdown - Whether to breakdown the results by food (optional)
   * @returns Array of objects: { food, time, nbrOrders }
   */
  async averageAllDishesTime(
    idRestaurant: number,
    timeBegin?: string,
    timeEnd?: string,
    breakdown?: boolean,
  ): Promise<
    | {
        time: { hours: number; minutes: number; seconds: number };
        nbrOrders: number;
      }
    | {
        food: number;
        time: { hours: number; minutes: number; seconds: number };
        nbrOrders: number;
      }[]
    | null
  > {
    const db = this.getDbConnection();
    const preparationTimes = [];
    let result = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $unwind: '$orders' },
        { $match: { 'orders.food_ordered.is_ready': true } },
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

    if (timeBegin && timeEnd) {
      const beginDate = new Date(timeBegin);
      const endDate = new Date(timeEnd);
      result = result.filter((item) => {
        const orderDate = new Date(item.orders.date);
        return orderDate >= beginDate && orderDate <= endDate;
      });
    }

    if (breakdown) {
      result.map((item) => {
        const orderDate = new Date(item.orders.date);

        item.orders.food_ordered.map((food) => {
          const preparationTime = new Date(food.timeReady);
          const timeDiff = orderDate.getTime() - preparationTime.getTime();
          preparationTimes.push(timeDiff / (1000 * 60));
        });
      });

      if (preparationTimes.length === 0) {
        return {
          time: {
            hours: 0,
            minutes: 0,
            seconds: 0,
          },
          nbrOrders: 0,
        };
      }

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
    } else {
      const dishMap = new Map();
      result.forEach((item) => {
        const orderDate = new Date(item.orders.date);
        item.orders.food_ordered.forEach((food) => {
          const preparationTime = new Date(food.timeReady);
          const timeDiff = orderDate.getTime() - preparationTime.getTime();
          const minutes = timeDiff / (1000 * 60);
          if (!dishMap.has(food.food)) {
            dishMap.set(food.food, []);
          }
          dishMap.get(food.food).push(minutes);
        });
      });

      const resultArray = [];
      for (const [food, times] of dishMap.entries()) {
        const averageTime =
          times.length > 0
            ? times.reduce((acc, t) => acc + t, 0) / times.length
            : 0;
        const totalSeconds = Math.round(averageTime * 60) * -1;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        resultArray.push({
          food,
          time: { hours, minutes, seconds },
          nbrOrders: times.length,
        });
      }

      if (resultArray.length === 0) {
        return null;
      }

      return resultArray;
    }
  }

  /**
   * Calculates the average time for orders to be served in a restaurant
   * @param idRestaurant - The restaurant identifier
   * @param timeBegin - Start date of the analysis period (optional)
   * @param timeEnd - End date of the analysis period (optional)
   * @param channel - The channel of orders to analyze (togo or eatin or undefined)
   * @returns An object containing the formatted average time and total number of orders
   */
  async averageTimeOrders(
    idRestaurant: number,
    timeBegin: string,
    timeEnd: string,
    channel: string,
  ) {
    const db = this.getDbConnection();
    const preparationTimes = [];
    let orders = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $unwind: '$orders' },
        { $match: { 'orders.served': true } },
        { $match: { 'orders.channel': channel || { $exists: true } } },
        {
          $project: {
            'orders.date': 1,
            'orders.timeServed': 1,
            _id: 0,
          },
        },
      ])
      .toArray();

    if (timeBegin && timeEnd) {
      const beginDate = new Date(timeBegin);
      const endDate = new Date(timeEnd);
      orders = orders.filter((item) => {
        const orderDate = new Date(item.orders.date);
        return orderDate >= beginDate && orderDate <= endDate;
      });
    }

    orders.map((item) => {
      const orderDate = new Date(item.orders.date);
      const preparationTime = new Date(item.orders.timeServed);
      const timeDiff = orderDate.getTime() - preparationTime.getTime();
      preparationTimes.push(timeDiff / (1000 * 60));
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
   * Returns the most ordered dish for a restaurant in a given period
   * @param idRestaurant - The restaurant identifier
   * @param timeBegin - Start date of the analysis period (optional)
   * @param timeEnd - End date of the analysis period (optional)
   * @returns Object containing the food id and the number of orders
   */
  async popularDish(
    idRestaurant: number,
    timeBegin?: string,
    timeEnd?: string,
  ): Promise<{ food: number; nbrOrders: number } | null> {
    const db = this.getDbConnection();
    let result = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $unwind: '$orders' },
        { $unwind: '$orders.food_ordered' },
        { $match: { 'orders.food_ordered.is_ready': true } },
        {
          $project: {
            'orders.date': 1,
            'orders.food_ordered.food': 1,
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

    const foodCount = new Map<number, number>();
    result.forEach((item) => {
      const foodId = item.orders.food_ordered.food;
      foodCount.set(foodId, (foodCount.get(foodId) || 0) + 1);
    });

    if (foodCount.size === 0) return null;

    let maxFood = null;
    let maxCount = 0;
    for (const [food, count] of foodCount.entries()) {
      if (count > maxCount) {
        maxFood = food;
        maxCount = count;
      }
    }

    return { food: maxFood, nbrOrders: maxCount };
  }

  /**
   * Get the number of clients for a specific period
   * @param idRestaurant - The restaurant identifier (must be positive)
   * @param timeBegin - Start date of the analysis period (optional)
   * @param timeEnd - End date of the analysis period (optional)
   * @param channel - The channel of the orders (optional)
   * @param served - Whether the orders are served (optional)
   * @returns The number of clients for the specified period
   */
  async clientsCount(
    idRestaurant: number,
    timeBegin: string,
    timeEnd: string,
    channel: string,
    served: boolean,
  ) {
    const db = this.getDbConnection();
    let clientsCount = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $unwind: '$orders' },
        { $match: { 'orders.channel': channel || { $exists: true } } },
        {
          $match: {
            'orders.served': served === undefined ? { $exists: true } : served,
            'orders.payment': { $exists: false },
          },
        },
        { $project: { _id: 1, 'orders.date': 1 } },
      ])
      .toArray();

    if (timeBegin && timeEnd) {
      const beginDate = new Date(timeBegin);
      const endDate = new Date(timeEnd);
      clientsCount = clientsCount.filter((item) => {
        const orderDate = new Date(item.orders.date);
        return orderDate >= beginDate && orderDate <= endDate;
      });
    }

    return clientsCount.length;
  }

  /**
   * Forecast daily dish sales for a restaurant for the current weekday and same day last year, adjusted for trend
   * @param idRestaurant - The restaurant identifier
   * @param dateStr - (optionnel) Date cible au format ISO (ex: 2025-05-28T20:58:53.621Z)
   * @returns Array of objects: { food, forecast } (forecast = moyenne pour ce jour de la semaine et valeur du même jour l'an passé, ajustée par la tendance)
   */
  async dishForecast(
    idRestaurant: number,
    dateStr?: string,
  ): Promise<{ food: number; forecast: number }[]> {
    const db = this.getDbConnection();
    const result = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $unwind: '$orders' },
        { $unwind: '$orders.food_ordered' },
        { $match: { 'orders.food_ordered.is_ready': true } },
        {
          $project: {
            'orders.date': 1,
            'orders.food_ordered.food': 1,
            _id: 0,
          },
        },
      ])
      .toArray();

    const targetDate = dateStr ? new Date(dateStr) : new Date();
    const targetWeekday = targetDate.getDay();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();
    const lastYear = targetDate.getFullYear() - 1;

    const salesByFoodWeekday: Record<number, { date: Date; count: number }[]> =
      {};
    const salesByFoodLastYear: Record<number, number> = {};

    result.forEach((item) => {
      const foodId = item.orders.food_ordered.food;
      const date = new Date(item.orders.date);
      if (date.getDay() === targetWeekday) {
        if (!salesByFoodWeekday[foodId]) salesByFoodWeekday[foodId] = [];
        salesByFoodWeekday[foodId].push({ date, count: 1 });
      }
      if (
        date.getFullYear() === lastYear &&
        date.getMonth() === targetMonth &&
        date.getDate() === targetDay
      ) {
        if (!salesByFoodLastYear[foodId]) salesByFoodLastYear[foodId] = 0;
        salesByFoodLastYear[foodId]++;
      }
    });

    const allFoodIds = new Set([
      ...Object.keys(salesByFoodWeekday).map(Number),
      ...Object.keys(salesByFoodLastYear).map(Number),
    ]);
    const forecasts = Array.from(allFoodIds).map((foodId) => {
      const weekdayArr = salesByFoodWeekday[foodId] || [];
      const lastYearVal = salesByFoodLastYear[foodId];
      const weekdayAvg = weekdayArr.length
        ? weekdayArr.reduce((a, b) => a + b.count, 0) / weekdayArr.length
        : undefined;
      let trend = 0;
      if (weekdayArr.length > 1) {
        const sorted = weekdayArr.sort(
          (a, b) => a.date.getTime() - b.date.getTime(),
        );
        const n = sorted.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = sorted.reduce((acc, v) => acc + v.count, 0);
        const sumXY = sorted.reduce((acc, v, i) => acc + i * v.count, 0);
        const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
        const denominator = n * sumX2 - sumX * sumX;
        if (denominator !== 0) {
          trend = (n * sumXY - sumX * sumY) / denominator;
        }
      }
      const values = [];
      if (weekdayAvg !== undefined) values.push(weekdayAvg);
      if (lastYearVal !== undefined) values.push(lastYearVal);
      let forecast = values.length
        ? values.reduce((a, b) => a + b, 0) / values.length
        : 0;
      forecast += trend;
      forecast = Math.max(0, Math.round(forecast));
      return { food: foodId, forecast };
    });

    return forecasts;
  }

  /**
   * Get the average basket value for a specific period
   * @param idRestaurant - The restaurant identifier (must be positive)
   * @param timeBegin - Start date of the analysis period (optional)
   * @param timeEnd - End date of the analysis period (optional)
   * @param channel - The channel of the orders (optional)
   * @returns The average basket value for the specified period and the number of orders
   */
  async averageBasket(
    idRestaurant: number,
    timeBegin: string,
    timeEnd: string,
    channel: string,
  ) {
    const db = this.getDbConnection();
    let orders = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $unwind: '$orders' },
        { $match: { 'orders.channel': channel || { $exists: true } } },
        { $project: { _id: 0, 'orders.date': 1, 'orders.total': 1 } },
      ])
      .toArray();

    if (timeBegin && timeEnd) {
      const beginDate = new Date(timeBegin);
      const endDate = new Date(timeEnd);
      orders = orders.filter((item) => {
        const orderDate = new Date(item.orders.date);
        return orderDate >= beginDate && orderDate <= endDate;
      });
    }

    const totalAmount = orders.reduce((sum, item) => {
      return sum + parseFloat(item.orders.total);
    }, 0);

    const average = orders.length > 0 ? totalAmount / orders.length : 0;

    return { 'Average value': average, 'Nbr orders': orders.length };
  }

  /**
   * Get the forecast for the ingredients
   * @param idRestaurant - The restaurant identifier
   * @param forecast - The forecast for the dishes
   * @returns The forecast for the ingredients
   */
  async ingredientsForecast(
    idRestaurant: number,
    forecast: { food: number; forecast: number }[],
    useCase: string = undefined,
  ) {
    const db = this.getDbConnection();
    const foodIds = forecast.map((f) => f.food);

    const restaurant = await db
      .collection('restaurant')
      .findOne(
        { id: idRestaurant },
        { projection: { _id: 0, foods: 1, ingredients: 1 } },
      );
    if (!restaurant || !restaurant.foods) return [];

    const forecastMap = new Map(forecast.map((f) => [f.food, f.forecast]));

    if (useCase === 'POS') {
      const ingredientCount: Record<
        number,
        { id: number; name: string; quantity: number; unit: string }
      > = {};

      restaurant.foods
        .filter((food: any) => foodIds.includes(food.id))
        .forEach((food: any) => {
          const forecastQty = forecastMap.get(food.id) || 0;
          if (Array.isArray(food.ingredients)) {
            food.ingredients.forEach(
              (ingredient: { id_ingredient: number; quantity: number }) => {
                const id = ingredient.id_ingredient;
                const base =
                  restaurant.ingredients?.find((ing: any) => ing.id === id) ||
                  {};

                if (!ingredientCount[id]) {
                  ingredientCount[id] = {
                    id,
                    name: base.name || '',
                    quantity: 0,
                    unit: base.unit || '',
                  };
                }
                ingredientCount[id].quantity +=
                  (ingredient.quantity || 1) * forecastQty;
              },
            );
          }
        });

      return Object.values(ingredientCount);
    } else {
      const ingredientCount: Record<number, number> = {};

      restaurant.foods
        .filter((food: any) => foodIds.includes(food.id))
        .forEach((food: any) => {
          const forecastQty = forecastMap.get(food.id) || 0;
          if (Array.isArray(food.ingredients)) {
            food.ingredients.forEach(
              (ingredient: { id_ingredient: number; quantity: number }) => {
                const id = ingredient.id_ingredient;
                if (!ingredientCount[id]) {
                  ingredientCount[id] = 0;
                }
                ingredientCount[id] += (ingredient.quantity || 1) * forecastQty;
              },
            );
          }
        });

      return Object.entries(ingredientCount).map(([id, quantity]) => ({
        id: parseInt(id, 10),
        quantity,
      }));
    }
  }

  /**
   * Calculates the total revenue of a restaurant over a given period
   * @param idRestaurant - The restaurant identifier
   * @param timeBegin - Start date of the period (optional)
   * @param timeEnd - End date of the period (optional)
   * @param channel - The order channel (optional)
   * @returns The total revenue and the number of orders
   */
  async revenueTotal(
    idRestaurant: number,
    timeBegin: string,
    timeEnd: string,
    channel?: string,
  ): Promise<{ total: number; ordersCount: number }> {
    const db = this.getDbConnection();
    let orders = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $unwind: '$orders' },
        { $match: { 'orders.channel': channel || { $exists: true } } },
        { $match: { 'orders.payment': { $exists: true } } },
        { $project: { _id: 0, 'orders.timePayment': 1, 'orders.total': 1 } },
      ])
      .toArray();

    if (timeBegin && timeEnd) {
      const beginDate = new Date(timeBegin);
      const endDate = new Date(timeEnd);
      orders = orders.filter((item) => {
        const orderDate = new Date(item.orders.timePayment);
        return orderDate >= beginDate && orderDate <= endDate;
      });
    }

    const totalRevenue = orders.reduce((sum, item) => {
      return sum + parseFloat(item.orders.total);
    }, 0);

    return { total: totalRevenue, ordersCount: orders.length };
  }
}
