import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { TransactionOrderType, TransactionStatus } from './transactions.enums';

@ObjectType({ description: 'Транзакция' })
@Schema({
  collection: 'transactions',
  minimize: false,
  timestamps: true,
  versionKey: false
})
export class TransactionEntitySchema {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, index: true })
  phone: string;

  @Prop({ required: true, index: true })
  orderId: string;

  @Prop({
    enum: Object.values(TransactionOrderType),
    required: true
  })
  orderType: TransactionOrderType;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({
    enum: TransactionStatus,
    required: true,
    default: TransactionStatus.PENDING,
    index: true
  })
  status: TransactionStatus;

  @Prop({ required: true, index: true })
  expiresAt: Date;

  @Prop({ required: false, default: undefined })
  cardCryptoPacket?: string;

  @Prop({ required: false, default: undefined })
  paidAt?: Date;

  @Prop({ required: false, default: null, index: true })
  accessToken?: string;
}

export type TransactionDocument = HydratedDocument<TransactionEntitySchema>;
export const TransactionSchema = SchemaFactory.createForClass(TransactionEntitySchema);
