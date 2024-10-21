/**
 * Represents a ingredient in a restaurant.
 *
 * Each ingredient is associated with a specific restaurant
 * and has an identifier, name and a price.
 *
 * @interface Ingredient
 */
export interface Ingredient {
  /**
   * The unique identifier of the ingredient.
   *
   * @type {number}
   */
  id: number;

  /**
   * The name of the ingredient.
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

  /**
   * The price of the ingredient.
   *
   * @type {number}
   */
  price: number;
}
