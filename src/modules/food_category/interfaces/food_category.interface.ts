/**
 * Represents a category of food in a restaurant.
 * 
 * Each food category is associated with a specific restaurant
 * and has an identifier and a name.
 * 
 * @interface FoodCategory
 */
export interface FoodCategory {
  /**
   * The unique identifier of the food category.
   * 
   * @type {number}
   */
  id: number;

  /**
   * The name of the food category.
   * 
   * @type {string}
   */
  name: string;

  /**
   * The ID of the restaurant the category belongs to.
   * 
   * @type {number}
   */
  id_restaurant: number;
}
