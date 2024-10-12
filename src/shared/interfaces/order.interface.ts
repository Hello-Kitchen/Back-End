/**
 * Represents an item that has been ordered, including details about the food,
 * modifications, and the restaurant it was ordered from.
 * 
 * @interface FoodOrdered
 */
interface FoodOrdered {
  /**
   * The unique identifier for the food item ordered.
   * 
   * @type {number}
   */
  id: number;

  /**
   * The identifier for the food itself, corresponding to its entry in the menu.
   * 
   * @type {number}
   */
  food: number;

  /**
   * An array of details or notes about the food item ordered.
   * 
   * @type {string[]}
   */
  details: string[];

  /**
   * An array of modifications applied to the ingredients of the food item.
   * Each modification consists of a type and the ingredient that is modified.
   * 
   * @type {{ type: string; ingredient: string }[]}
   */
  mods_ingredients: { type: string; ingredient: string }[];

  /**
   * The part number indicating which part of the order this item belongs to.
   * 
   * @type {number}
   */
  part: number;

  /**
   * The identifier of the restaurant from which the food was ordered.
   * 
   * @type {number}
   */
  id_restaurant: number;

  /**
   * Indicates whether the food item is ready for pickup or delivery.
   * This property is set to false by default.
   * 
   * @type {boolean}
   */
  is_ready: false;

  /**
   * Notes or comments regarding the food item ordered.
   * 
   * @type {string}
   */
  note: string;
}

/**
 * Represents an order containing information about the restaurant,
 * the ordering channel, and the food items ordered.
 * 
 * @interface Order
 */
export interface Order {
  /**
   * The unique identifier for the order.
   * 
   * @type {number}
   */
  id: number;

  /**
   * The identifier for the restaurant where the order was placed.
   * 
   * @type {number}
   */
  id_restaurant: number;

  /**
   * The channel through which the order was placed (e.g., online, phone).
   * 
   * @type {string}
   */
  channel: string;

  /**
   * The order number associated with the transaction.
   * 
   * @type {string}
   */
  number: string;

  /**
   * An array of food items that have been ordered.
   * 
   * @type {FoodOrdered[]}
   */
  food_ordered: FoodOrdered[];

  /**
   * The part number indicating which part of the order this represents.
   * 
   * @type {number}
   */
  part: number;

  /**
   * The date when the order was placed.
   * 
   * @type {string}
   */
  date: string;
}
