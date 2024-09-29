import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ type: Number, required: true, description: 'Doit être un entier et est obligatoire' })
  id: number;

  @Prop({ type: Number, required: true, description: 'Doit être un entier' })
  id_restaurant: number;

  @Prop({ type: [String], required: true, description: 'Doit être un tableau et est obligatoire' })
  food_ordered: string[];

  @Prop({ type: String, required: true, description: 'Doit être une date et est obligatoire' })
  date: string;

  @Prop({ type: String, enum: ['online', 'offline'], description: 'Doit être un enum' })
  channel: string;

  @Prop({ type: String, description: 'Doit être une chaîne de caractères' })
  number: string;

  @Prop({ type: Number, required: true, description: 'Doit être un entier et est obligatoire' })
  part: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
