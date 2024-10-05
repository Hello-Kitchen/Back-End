interface FoodOrdered {
  id: number;
  food: number;
  details: string[];
  mods_ingredients: { type: string; ingredient: string }[];
  part: number;
  id_restaurant: number;
  is_ready: false;
  note: string;
}

export interface Order {
  id: number;
  id_restaurant: number;
  channel: string;
  number: string;
  food_ordered: FoodOrdered[];
  part: number;
  date: string;
}
