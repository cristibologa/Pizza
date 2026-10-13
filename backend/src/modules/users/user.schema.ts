import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'users',
  minimize: false,
  versionKey: false
})
export class UserEntitySchema {
  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  firstname?: string;

  @Prop()
  middlename?: string;

  @Prop()
  lastname?: string;

  @Prop()
  email?: string;

  @Prop()
  city?: string;
}

export type UserDocument = HydratedDocument<UserEntitySchema>;
export const UserSchema = SchemaFactory.createForClass(UserEntitySchema);
