import { Injectable } from '@nestjs/common';
import mongoose, { AnyObject } from 'mongoose';
import { UpdateResult, ReturnDocument, WithId } from 'mongodb';
import { DB } from '../../db/db';
import { Counter } from '../../shared/interfaces/counter.interface';
import { Restaurant } from '../../shared/interfaces/restaurant.interface';
import { OrdersDto } from './DTO/orders.dto';
import { PaymentDto } from './DTO/payment.dto';

@Injectable()
export class OrdersService extends DB {
  /**
   * @brief Retrieves all orders for a specific restaurant.
   *
   * This asynchronous function connects to the MongoDB database and retrieves all
   * orders for the restaurant identified by the given `idRestaurant`. The result
   * is an array of orders found for the restaurant.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant to retrieve orders from.
   * @return {Promise<mongoose.mongo.BSON.Document>} Returns a promise that resolves to
   * an array of orders for the restaurant.
   */
  async findAll(idRestaurant: number): Promise<mongoose.mongo.BSON.Document> {
    const db = this.getDbConnection();

    const result = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $project: { orders: 1 } },
        { $unwind: '$orders' },
        { $group: { _id: '$_id', orders: { $push: '$orders' } } },
      ])
      .toArray();

    return result[0].orders;
  }

  /**
   * @brief Retrieves all orders for a specific restaurant, sorted by date.
   *
   * This asynchronous function retrieves all orders for the restaurant identified by
   * the given `idRestaurant`, sorting them by date in descending order.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant to retrieve orders from.
   * @return {Promise<mongoose.mongo.BSON.Document>} Returns a promise that resolves to
   * an array of orders for the restaurant, sorted by date in descending order.
   */
  async findAllSortedByDate(
    idRestaurant: number,
  ): Promise<mongoose.mongo.BSON.Document> {
    const db = this.getDbConnection();

    const result = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $project: { orders: 1 } },
        { $unwind: '$orders' },
        { $sort: { 'orders.date': 1 } },
        { $group: { _id: '$_id', orders: { $push: '$orders' } } },
      ])
      .toArray();
    return result[0].orders;
  }

  /**
   * @brief Retrieves all orders for a specific restaurant where all food items are marked as ready.
   *
   * This asynchronous function retrieves all orders for the given `idRestaurant` and filters the
   * results to include only those orders where all food items in the order are marked as ready (`is_ready` is `true`).
   *
   * @param {number} idRestaurant The unique identifier of the restaurant to retrieve orders from.
   * @return {Promise<any>} A promise that resolves to an array of filtered orders where all food items are ready.
   */
  async findReady(idRestaurant: number): Promise<any> {
    const db = this.getDbConnection();
    const result = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $project: { orders: 1 } },
        { $unwind: '$orders' },
        { $match: { 'orders.served': false } },
        { $group: { _id: '$_id', orders: { $push: '$orders' } } },
      ])
      .toArray();

    const filteredOrders = result[0].orders.filter((order) => {
      const orderPart = order.part;
      const allReady = order.food_ordered
        .filter((food) => food.part === orderPart)
        .every((food) => food.is_ready === true);

      return allReady;
    });

    return filteredOrders;
  }

  /**
   * @brief Retrieves all orders for a specific restaurant where all food items are marked as ready, sorted by date.
   *
   * This asynchronous function retrieves all orders for the given `idRestaurant`, filters the results to include only
   * those where all food items are marked as ready (`is_ready` is `true`), and sorts the orders by date in descending order.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant to retrieve orders from.
   * @return {Promise<any>} A promise that resolves to an array of filtered and sorted orders where all food items are ready.
   */
  async findReadySortedByDate(idRestaurant: number): Promise<any> {
    const db = this.getDbConnection();
    const result = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $project: { orders: 1 } },
        { $unwind: '$orders' },
        { $match: { 'orders.served': false } },
        { $sort: { 'orders.date': 1 } },
        { $group: { _id: '$_id', orders: { $push: '$orders' } } },
      ])
      .toArray();

    const filteredOrders = result[0].orders.filter((order) => {
      const orderPart = order.part;
      const relevantFoods = order.food_ordered.filter(
        (food) => food.part === orderPart,
      );
      const allReady =
        relevantFoods.length > 0 &&
        relevantFoods.every((food) => food.is_ready === true);

      return allReady;
    });

    return filteredOrders;
  }

  /**
   * @brief Retrieves all orders for a specific restaurant where some but not all food items are ready (pending orders).
   *
   * This asynchronous function retrieves all orders for the given `idRestaurant` and filters the results to include only
   * those orders where at least one food item is ready, but not all food items are ready (i.e., pending orders).
   *
   * @param {number} idRestaurant The unique identifier of the restaurant to retrieve pending orders from.
   * @return {Promise<any>} A promise that resolves to an array of filtered pending orders.
   */
  async findPending(idRestaurant: number): Promise<any> {
    const db = this.getDbConnection();
    const result = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $project: { orders: 1 } },
        { $unwind: '$orders' },
        { $group: { _id: '$_id', orders: { $push: '$orders' } } },
      ])
      .toArray();

    const filteredOrders = result[0].orders.filter((order) => {
      const orderPart = order.part;
      const relevantFoods = order.food_ordered.filter(
        (food) => food.part === orderPart,
      );
      const readyCount = relevantFoods.filter((food) => food.is_ready).length;

      return readyCount > 0 && readyCount < relevantFoods.length;
    });

    return filteredOrders;
  }

  /**
   * @brief Retrieves all pending orders for a specific restaurant, sorted by date.
   *
   * This asynchronous function retrieves all orders for the given `idRestaurant`, filters the
   * results to include only those where some but not all food items are ready (pending orders),
   * and sorts the orders by date in descending order.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant to retrieve pending orders from.
   * @return {Promise<any>} A promise that resolves to an array of filtered and sorted pending orders.
   */
  async findPendingSortedByDate(idRestaurant: number): Promise<any> {
    const db = this.getDbConnection();
    const result = await db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $project: { orders: 1 } },
        { $unwind: '$orders' },
        { $sort: { 'orders.date': 1 } },
        { $group: { _id: '$_id', orders: { $push: '$orders' } } },
      ])
      .toArray();

    const filteredOrders = result[0].orders.filter((order) => {
      const orderPart = order.part;
      const relevantFoods = order.food_ordered.filter(
        (food) => food.part === orderPart,
      );
      const readyCount = relevantFoods.filter((food) => food.is_ready).length;

      // Return orders where some but not all food items are ready
      return readyCount > 0 && readyCount < relevantFoods.length;
    });

    return filteredOrders;
  }

  /**
   * @brief Retrieves a specific order by its ID for a given restaurant.
   *
   * This asynchronous function fetches a specific order from the restaurant identified by `idRestaurant`
   * and returns the order that matches the given `id`. The result excludes the `_id` field of the restaurant document.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant to search in.
   * @param {number} id The unique identifier of the order to retrieve.
   * @return {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} A promise that resolves to the matching order, or null if not found.
   */
  async findById(
    idRestaurant: number,
    id: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .findOne(
        { id: idRestaurant },
        { projection: { _id: 0, orders: { $elemMatch: { id: id } } } },
      );
  }

  /**
   * @brief Retrieves a specific order by its ID for a given restaurant, including food items associated with that order.
   *
   * This asynchronous function fetches a specific order from the restaurant identified by `idRestaurant`,
   * filters the order by the given `id`, and retrieves the associated food items. The result includes details
   * of the food items in the order, grouped by the order's ID.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant to search in.
   * @param {number} id The unique identifier of the order to retrieve.
   * @return {Promise<mongoose.mongo.BSON.Document[]>} A promise that resolves to an array of documents containing the order details and associated food items.
   */
  async findByIdWithParam(
    idRestaurant: number,
    id: number,
  ): Promise<mongoose.mongo.BSON.Document[]> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .aggregate([
        {
          $match: { id: idRestaurant },
        },
        {
          $match: { 'orders.id': id },
        },
        {
          $unwind: '$orders',
        },
        {
          $match: { 'orders.id': id },
        },
        {
          $unwind: '$orders.food_ordered',
        },
        {
          $match: {
            $expr: {
              $eq: ['$orders.food_ordered.part', '$orders.part'],
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            food_ordered: {
              $push: {
                food: '$orders.food_ordered.food',
                details: '$orders.food_ordered.details',
                mods_ingredients: '$orders.food_ordered.mods_ingredients',
                is_ready: '$orders.food_ordered.is_ready',
                note: '$orders.food_ordered.note',
                id: '$orders.food_ordered.id',
              },
            },
          },
        },
      ])
      .toArray();
  }

  /**
   * @brief Retrieves specific food items by their IDs for a given restaurant.
   *
   * This asynchronous function fetches food items from the restaurant identified by `idRestaurant`.
   * It returns the food items that match the provided array of `id`s. The result excludes the `_id`
   * field of the restaurant document.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant to search in.
   * @param {number} id An array of unique identifiers for the food items to retrieve.
   * @return {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} A promise that resolves to the matching food items, or null if not found.
   */
  async findFoodByIdsWithParam(
    idRestaurant: number,
    id: number[],
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db.collection('restaurant').findOne(
      { id: idRestaurant },
      {
        projection: {
          _id: 0,
          foods: {
            $elemMatch: { id: id },
          },
        },
      },
    );
  }

  /**
   * @brief Retrieves orders based on the provided parameters.
   *
   * This function executes an aggregation on the 'restaurant' collection
   * using the specified parameters to filter and transform the order data.
   *
   * @param {object[]} param - An array of aggregation pipeline stages to apply.
   * @returns {Promise<mongoose.mongo.BSON.Document[]>} A promise that resolves to an array of orders matching the aggregation criteria.
   */

  async findOrderWithParam(
    param: object[],
  ): Promise<mongoose.mongo.BSON.Document[]> {
    const db = this.getDbConnection();

    return db.collection('restaurant').aggregate(param).toArray();
  }

  /**
   * @brief Retrieves orders for a specific table in a restaurant.
   *
   * This asynchronous function retrieves all orders for the given `idRestaurant` and filters the results to include only
   * those orders that are associated with the specified `tableID`.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant to search in.
   * @param {number} tableID The unique identifier of the table to retrieve orders from.
   * @return {Promise<mongoose.mongo.BSON.Document>} A promise that resolves to an array of orders associated with the specified table.
   */
  async findByTableID(
    idRestaurant: number,
    tableID: number,
  ): Promise<mongoose.mongo.BSON.Document> {
    const db = this.getDbConnection();
    const id = await db
      .collection('restaurant')
      .findOne(
        { id: idRestaurant, 'pos_config.tables.id': tableID },
        { projection: { _id: 0, orderId: 1 } },
      );
    return db
      .collection('restaurant')
      .findOne(
        { id: idRestaurant, 'orders.id': id.orderId },
        { projection: { _id: 0 } },
      );
  }

  /**
   * @brief Creates a new order for a specified restaurant.
   *
   * This asynchronous function generates a unique ID for the order and each food item in the order
   * and then adds the new order to the restaurant's orders. The order ID is retrieved and incremented
   * from a counter collection. Each food item in the `food_ordered` array is also assigned a unique ID.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant to which the order will be added.
   * @param {OrdersDto} body A stream containing the order details, including the food items ordered.
   * @return {Promise<AnyObject>} A promise that resolves to the result of the update operation.
   */
  async createOne(
    idRestaurant: number,
    body: OrdersDto,
    idTable: number,
  ): Promise<AnyObject> {
    const db = this.getDbConnection();
    const id = await db
      .collection<Counter>('counter')
      .findOneAndUpdate(
        { _id: 'orderId' },
        { $inc: { sequence_value: 1 } },
        { returnDocument: ReturnDocument.AFTER },
      );

    let total = 0;
    body['id'] = id.sequence_value;
    body['served'] = false;
    for (const food of body['food_ordered']) {
      total += Number(food.price);
      const id = await db
        .collection<Counter>('counter')
        .findOneAndUpdate(
          { _id: 'foodOrderId' },
          { $inc: { sequence_value: 1 } },
          { returnDocument: ReturnDocument.AFTER },
        );

      food['id'] = id.sequence_value;
    }
    body['total'] = total;
    if (!Number.isNaN(idTable)) {
      await db.collection('restaurant').updateOne(
        { id: idRestaurant, 'pos_config.tables.id': idTable },
        {
          $set: {
            'pos_config.tables.$.orderId': id.sequence_value,
          },
        },
      );
    }
    await db
      .collection('restaurant')
      .updateOne({ id: idRestaurant }, { $addToSet: { orders: body } });
    return { orderId: id.sequence_value };
  }

  /**
   * @brief Updates a specific order for a given restaurant.
   *
   * This asynchronous function updates the details of an existing order identified by `id`
   * for the restaurant specified by `idRestaurant`. It sets the new values for various fields
   * of the order, including the channel, number, food ordered, part, and date.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant that contains the order to update.
   * @param {number} id The unique identifier of the order to be updated.
   * @param {OrdersDto} body A stream containing the updated order details.
   * @return {Promise<UpdateResult>} A promise that resolves to the result of the update operation.
   */
  async updateOne(
    idRestaurant: number,
    id: number,
    body: OrdersDto,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    let total = 0;
    for (const food of body['food_ordered']) total += Number(food.price);
    body['total'] = total;
    return db.collection('restaurant').updateOne(
      { id: idRestaurant, 'orders.id': id },
      {
        $set: {
          'orders.$.channel': body['channel'],
          'orders.$.number': body['number'],
          'orders.$.food_ordered': body['food_ordered'],
          'orders.$.part': body['part'],
          'orders.$.date': body['date'],
          'orders.$.served': body['served'],
          'orders.$.total': body['total'],
        },
      },
    );
  }

  /**
   * @brief Deletes a specific order from a given restaurant.
   *
   * This asynchronous function removes an order identified by `id` from the orders array
   * of the restaurant specified by `idRestaurant`. The order is removed using the `$pull`
   * operator to ensure that the matching order is deleted from the array.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant from which the order will be deleted.
   * @param {number} id The unique identifier of the order to be deleted.
   * @return {Promise<UpdateResult>} A promise that resolves to the result of the update operation.
   */
  async deleteOne(idRestaurant: number, id: number): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db
      .collection<Restaurant>('restaurant')
      .updateOne({ id: idRestaurant }, { $pull: { orders: { id: id } } });
  }

  /**
   * @brief Marks a specific food item as ready or not ready for a given restaurant.
   *
   * This asynchronous function toggles the `is_ready` status of a food item identified by
   * `idFoodOrdered` in the orders of the restaurant specified by `idRestaurant`.
   * It first retrieves the current readiness status and then updates it in the database.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant containing the order.
   * @param {number} idFoodOrdered The unique identifier of the food item to be marked as ready or not ready.
   * @return {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} A promise that resolves to the result of the update operation.
   */
  async markFoodOrderedReady(
    idRestaurant: number,
    idFoodOrdered: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();
    const res = await db
      .collection('restaurant')
      .findOne({ id: idRestaurant }, { projection: { _id: 0, orders: 1 } });
    let value: boolean;

    for (const order of res.orders) {
      for (const food of order.food_ordered) {
        if (food.id === idFoodOrdered) value = !food.is_ready;
      }
    }

    return await db.collection('restaurant').findOneAndUpdate(
      {
        id: idRestaurant,
        'orders.food_ordered.id': idFoodOrdered,
      },
      {
        $set: { 'orders.$[].food_ordered.$[food].is_ready': value },
      },
      {
        arrayFilters: [{ 'food.id': idFoodOrdered }],
      },
    );
  }

  /**
   * @brief Increments the 'part' field in a specific order within a restaurant's document.
   *
   * This method updates the `part` field of an order in the `orders` array of the restaurant document.
   * It increments the value of `part` by 1 for the order identified by `orderId`.
   *
   * @param {number} restaurantId The ID of the restaurant containing the order.
   * @param {number} orderId The ID of the order whose 'part' field will be incremented.
   * @returns {Promise<WithId<AnyObject>>} Returns the updated restaurant document including the modified order.
   */
  async incrementOrderPart(
    restaurantId: number,
    orderId: number,
  ): Promise<WithId<AnyObject>> {
    const db = this.getDbConnection();

    return await db
      .collection('restaurant')
      .findOneAndUpdate(
        { id: restaurantId, 'orders.id': orderId },
        { $inc: { 'orders.$.part': 1 } },
      );
  }

  /**
   * @brief Marks a specific food item as ready or not ready for a given restaurant.
   *
   * This asynchronous function toggles the `is_ready` status of a food item identified by
   * `idOrder` in the orders of the restaurant specified by `idRestaurant`.
   * It first retrieves the current readiness status and then updates it in the database.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant containing the order.
   * @param {number} idOrder The unique identifier of the food item to be marked as ready or not ready.
   * @return {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} A promise that resolves to the result of the update operation.
   */
  async changeValueServed(
    idRestaurant: number,
    idOrder: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();
    const res = await db
      .collection('restaurant')
      .findOne({ id: idRestaurant }, { projection: { _id: 0, orders: 1 } });
    let value: boolean;

    for (const order of res.orders) {
      if (order.id === idOrder) value = !order.served;
    }

    return await db.collection('restaurant').findOneAndUpdate(
      {
        id: idRestaurant,
        'orders.id': idOrder,
      },
      {
        $set: { 'orders.$.served': value },
      },
    );
  }

  /**
   * @brief Marks a specific food item as ready or not ready for a given restaurant.
   *
   * This asynchronous function toggles the `is_ready` status of a food item identified by
   * `idOrder` in the orders of the restaurant specified by `idRestaurant`.
   * It first retrieves the current readiness status and then updates it in the database.
   *
   * @param {number} idRestaurant The unique identifier of the restaurant containing the order.
   * @param {number} idOrder The unique identifier of the food item to be marked as ready or not ready.
   * @return {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} A promise that resolves to the result of the update operation.
   */
  async newIdOrder(
    idRestaurant: number,
    channel: string,
  ): Promise<mongoose.mongo.WithId<Counter>> {
    const db = this.getDbConnection();
    const id = await db
      .collection<Counter>('counter')
      .findOneAndUpdate(
        { _id: channel === 'togo' ? 'orderOutId' : 'orderInId' },
        { $inc: { sequence_value: 1 } },
        { returnDocument: ReturnDocument.AFTER },
      );
    return id;
  }

  /**
   * @brief Adds a payment to a specific order in a restaurant.
   *
   * This method updates the `payment` field of an order identified by `idOrder` in the restaurant
   * specified by `idRestaurant`. It uses the `payment` object from the `PaymentDto` to update the
   *
   * @param {number} idRestaurant The ID of the restaurant where the order is located.
   * @param {number} idOrder The ID of the order that will be modified.
   * @param {PaymentDto} paymentDTO - The request object containing updated payment details.
   * @returns {Promise<mongoose.mongo.UpdateResult<mongoose.AnyObject>>} A promise that resolves to the result of the update operation.
   */

  async addPayment(
    idRestaurant: number,
    idOrder: number,
    payment: PaymentDto,
  ): Promise<mongoose.mongo.UpdateResult<mongoose.AnyObject>> {
    const db = this.getDbConnection();
    return await db
      .collection('restaurant')
      .updateOne(
        { id: idRestaurant, 'orders.id': idOrder },
        { $set: { 'orders.$.payment': payment } },
      );
  }
}
