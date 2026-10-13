import type { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PizzaAddress, PizzaCommission, PizzaOrderedItem, PizzaPerson } from '../../entities';
import { PizzaStatus } from './pizza-orders.enums';

@Schema({
  collection: 'pizzas/orders',
  timestamps: true
})
export class PizzaOrderEntitySchema {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  items: PizzaOrderedItem[];

  @Prop({ required: true, default: 0 })
  itemsPrice: number;

  @Prop({ type: Object, required: true })
  commission: PizzaCommission;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  person: PizzaPerson;

  @Prop({ required: true })
  receiverAddress: PizzaAddress;

  @Prop({
    enum: Object.values(PizzaStatus),
    required: true,
    default: PizzaStatus.AWAITING_PAYMENT,
    index: true
  })
  status: PizzaStatus;

  @Prop({ required: true, default: true })
  cancellable: boolean;

  @Prop({ required: false, default: undefined, index: true })
  transactionId?: string;
}

export type PizzaOrderDocument = HydratedDocument<PizzaOrderEntitySchema>;
export const PizzaOrderSchema = SchemaFactory.createForClass(PizzaOrderEntitySchema);
