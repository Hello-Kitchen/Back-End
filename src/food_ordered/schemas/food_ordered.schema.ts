import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FoodOrdered extends Document {
  @Prop({ type: Number, required: true, description: 'Doit être un entier et est obligatoire' })
  id: number;

  @Prop({ type: Number, required: true, description: 'Doit être un entier' })
  id_restaurant: number;

  @Prop({ type: Number, required: true, description: 'Doit être un entier et est obligatoire' })
  food: number;

  @Prop({ type: [String], required: true, description: 'Doit être un tableau de chaînes de caractères et est obligatoire' })
  mods_ingredients: string[];

  @Prop({ type: [String], description: 'Doit être un tableau de chaînes de caractères' })
  details: string[];

  @Prop({ type: String, description: 'Doit être une chaîne de caractères' })
  note: string;

  @Prop({ type: Boolean, description: 'Doit être un boolean' })
  is_ready: boolean;

  @Prop({ type: Number, required: true, description: 'Doit être un entier et est obligatoire' })
  part: number;
}

export const FoodOrderedSchema = SchemaFactory.createForClass(FoodOrdered);
