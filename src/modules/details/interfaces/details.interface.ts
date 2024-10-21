/**
 * Represents the details of a specific item related to a restaurant.
 *
 * The `Details` interface defines the structure of detail objects,
 * including their unique identifier, associated restaurant, and data.
 *
 * @interface Details
 */
export interface Details {
  /**
   * The unique identifier for the detail.
   *
   * @type {number}
   */
  id: number;

  /**
   * The name of the detail, providing a description or label.
   *
   * @type {string}
   */
  name: string;

  /**
   * The identifier for the restaurant associated with this detail.
   *
   * @type {number}
   */
  id_restaurant: number;

  /**
   * Indicates whether multiple values can be associated with this detail.
   *
   * @type {boolean}
   */
  multiple: boolean;

  /**
   * An array of data entries related to this detail.
   *
   * @type {string[]}
   */
  data: string[];
}
