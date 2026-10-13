import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { GameDeliveryType, GameRegion } from '../../constants';
import { GameOrderPerson } from './game-order.entity';
import { GameOrderStatus } from './game-order.enums';

@Schema({
  collection: 'games/order',
  minimize: false,
  timestamps: true,
  versionKey: false
})
export class GameOrderEntitySchema {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  person: GameOrderPerson;

  @Prop({ required: true, index: true })
  gameSlug: string;

  @Prop({ required: true })
  gameName: string;

  @Prop({ required: true })
  gameImage: string;

  @Prop({ enum: Object.values(GameRegion), required: true })
  region: GameRegion;

  @Prop({ required: true })
  price: number;

  @Prop({ enum: Object.values(GameDeliveryType), required: true })
  deliveryType: GameDeliveryType;

  @Prop({ required: true })
  edition: string;

  @Prop({
    enum: Object.values(GameOrderStatus),
    required: true,
    default: GameOrderStatus.AWAITING_PAYMENT,
    index: true
  })
  status: GameOrderStatus;

  @Prop({ type: String, required: false, default: null })
  gameKey?: string | null;

  @Prop({ type: String, required: false, default: null, index: true })
  transactionId?: string | null;
}

export type GameOrderDocument = HydratedDocument<GameOrderEntitySchema>;
export const GameOrderSchema = SchemaFactory.createForClass(GameOrderEntitySchema);
