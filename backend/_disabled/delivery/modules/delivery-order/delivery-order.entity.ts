import type { Document } from 'mongoose';

import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import {
  DeliveryOptionType,
  DeliveryPackageType,
  DeliveryPerson,
  DeliveryPoint,
  DeliveryReceiverAddress,
  DeliverySenderAddress
} from '../../entities';

export enum Payer {
  RECEIVER = 'receiver',
  SENDER = 'sender'
}
registerEnumType(Payer, {
  name: 'Payer'
});

export enum DeliveryStatus {
  IN_PROCESSING = 'in_processing',
  WAITING_COURIER = 'waiting_courier',
  ON_MY_WAY = 'on_my_way',
  SUCCESS = 'success',
  CANCELED = 'canceled'
}
registerEnumType(DeliveryStatus, {
  name: 'DeliveryStatus'
});

@InputType('DeliveryOrderInput')
@ObjectType()
@Schema({
  collection: 'delivery/order',
  minimize: false,
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
export class DeliveryOrder {
  @ApiProperty({ type: String, description: 'ID заказа' })
  @Field(() => String)
  _id: Types.ObjectId;

  @ApiProperty({ type: Number, description: 'Цена доставки' })
  @Field(() => Number)
  @Prop({ required: true })
  price: number;

  @ApiProperty({ type: DeliveryPackageType, description: 'Тип посылки' })
  @Field(() => DeliveryPackageType)
  @Prop({ required: true })
  package: DeliveryPackageType;

  @ApiProperty({
    description: 'Тип доставки',
    example: DeliveryOptionType.DEFAULT,
    enum: DeliveryOptionType,
    enumName: 'DeliveryOptionType'
  })
  @Field(() => DeliveryOptionType)
  @Prop({ required: true })
  option: DeliveryOptionType;

  @ApiProperty({ type: DeliveryPoint, description: 'Город отправки' })
  @Field(() => DeliveryPoint)
  @Prop({ required: true })
  senderPoint: DeliveryPoint;

  @ApiProperty({ type: DeliverySenderAddress, description: 'Адрес отправителя' })
  @Field(() => DeliverySenderAddress)
  @Prop({ required: true })
  senderAddress: DeliverySenderAddress;

  @ApiProperty({ type: DeliveryPerson, description: 'Отправитель' })
  @Field(() => DeliveryPerson)
  @Prop({ required: true })
  sender: DeliveryPerson;

  @ApiProperty({ type: DeliveryPoint, description: 'Город получения' })
  @Field(() => DeliveryPoint)
  @Prop({ required: true })
  receiverPoint: DeliveryPoint;

  @ApiProperty({ type: DeliveryReceiverAddress, description: 'Адрес получателя' })
  @Field(() => DeliveryReceiverAddress)
  @Prop({ required: true })
  receiverAddress: DeliveryReceiverAddress;

  @ApiProperty({ type: DeliveryPerson, description: 'Получатель' })
  @Field(() => DeliveryPerson)
  @Prop({ required: true })
  receiver: DeliveryPerson;

  @ApiProperty({
    description: 'Кто будет оплачивать',
    example: Payer.SENDER,
    enum: Payer,
    enumName: 'Payer'
  })
  @Field(() => Payer)
  @Prop({ required: true })
  payer: Payer;

  @ApiProperty({
    description: 'Статус доставки',
    example: DeliveryStatus.IN_PROCESSING,
    enum: DeliveryStatus,
    enumName: 'DeliveryStatus'
  })
  @Field(() => DeliveryStatus)
  @Prop({ required: true, default: DeliveryStatus.IN_PROCESSING })
  status: DeliveryStatus;

  @ApiProperty({ type: Boolean, description: 'Статус отмены' })
  @Field(() => Boolean)
  @Prop({ required: true, default: true })
  cancellable: boolean;
}

export type DeliveryOrderDocument = DeliveryOrder & Document;
export const DeliveryOrderSchema = SchemaFactory.createForClass(DeliveryOrder);
