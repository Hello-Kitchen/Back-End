import { FoodOrdered } from 'src/modules/food_ordered/interfaces/food_ordered.interface';

export interface Order {
  id: number;
  id_restaurant: number;
  channel: string;
  number: string;
  food_ordered: FoodOrdered[];
  part: number;
  date: string;
}
