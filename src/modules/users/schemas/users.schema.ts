import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    type: Number,
    required: true,
    description: 'Doit être un entier et est obligatoire',
  })
  id: number;

  @Prop({ type: Number, required: true, description: 'Doit être un entier' })
  id_restaurant: number;

  @Prop({
    type: String,
    required: true,
    description: 'Doit être une chaîne de caractères',
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    description: 'Doit être une chaîne de caractères',
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    description: 'Doit être une chaîne de caractères',
  })
  firstname: string;

  @Prop({
    type: String,
    required: true,
    description: 'Doit être une chaîne de caractères',
  })
  lastname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
