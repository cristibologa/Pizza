import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@ObjectType({ description: 'Банковская карта' })
@Schema({
  collection: 'cards',
  minimize: false,
  versionKey: false
})
export class CardEntitySchema {
  @Prop({ required: true, index: true })
  phone: string;

  @Prop({ required: true })
  panMasked: string;

  @Prop({ required: true })
  expiry: string;

  @Prop({ required: false })
  cryptoPacket: string;
}

export type CardDocument = HydratedDocument<CardEntitySchema>;
export const CardSchema = SchemaFactory.createForClass(CardEntitySchema);
