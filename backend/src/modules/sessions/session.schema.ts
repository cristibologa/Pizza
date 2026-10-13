import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@ObjectType({ description: 'Сессия' })
@Schema({
  collection: 'sessions',
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
})
export class SessionEntitySchema {
  createdAt: Date;

  @Prop({
    required: true,
    index: {
      expires: 0
    }
  })
  expiresAt: Date;

  @Prop({ type: Types.ObjectId, required: true, index: true, ref: 'User' })
  userId: Types.ObjectId;
}

export type SessionDocument = HydratedDocument<SessionEntitySchema>;
export const SessionSchema = SchemaFactory.createForClass(SessionEntitySchema);
