/**
 * @interface Food
 * 
 * Represents a food item in the system.
 * 
 * The `Food` interface defines the structure of a food item, including 
 * its identifying properties, price, associated categories, restaurant 
 * information, and details regarding the food item.
 */
export interface Food {
  /**
   * Unique identifier for the food item.
   * @type {number}
   */
  id: number;

  /**
   * Name of the food item.
   * @type {string}
   */
  name: string;

  /**
   * Price of the food item.
   * @type {number}
   */
  price: number;

  /**
   * Identifier for the category the food item belongs to.
   * @type {number}
   */
  id_category: number;

  /**
   * Identifier for the restaurant that offers the food item.
   * @type {number}
   */
  id_restaurant: number;

  /**
   * List of identifiers for details associated with the food item.
   * @type {number[]}
   */
  details: number[];

  /**
   * List of identifiers for ingredients used in the food item.
   * @type {number[]}
   */
  ingredients: number[];
}

