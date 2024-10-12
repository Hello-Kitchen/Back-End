/**
 * Represents a counter for generating unique sequential values.
 * 
 * The `Counter` interface defines the structure of a counter object used
 * in the application to maintain a sequence value, typically for unique IDs.
 * 
 * @interface Counter
 */
export interface Counter {
  /**
   * The unique identifier for the counter.
   * 
   * This is typically a string that corresponds to the counter's ID in the database.
   * 
   * @type {string}
   */
  _id: string;

  /**
   * The current sequence value of the counter.
   * 
   * This value is incremented to provide unique values for entities in the application.
   * 
   * @type {number}
   */
  sequence_value: number;
}
