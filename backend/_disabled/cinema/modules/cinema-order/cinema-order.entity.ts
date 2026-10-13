import type { Document } from 'mongoose';

import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { Film, FilmPerson } from '../../entities';
import { CinemaTicket } from '../cinema-ticket';

export enum CinemaOrderStatus {
  PAID = 'paid',
  CANCELED = 'canceled'
}

registerEnumType(CinemaOrderStatus, {
  name: 'CinemaOrderStatus'
});

@InputType('CinemaOrderInput')
@ObjectType()
@Schema({
  collection: 'cinema/order',
  minimize: false,
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
export class CinemaOrder {
  @ApiProperty({ type: String, description: 'ID заказа' })
  @Field(() => String)
  _id: Types.ObjectId;

  @ApiProperty({ type: Film, description: 'Название фильма' })
  @Field(() => Film)
  @Prop({ required: true })
  film: Film;

  @ApiProperty({ description: 'Номер заказа' })
  @Field(() => Number)
  @Prop({ required: true })
  orderNumber: number;

  @ApiProperty({ type: [CinemaTicket], description: 'Билеты' })
  @Field(() => [CinemaTicket])
  @Prop({ required: true })
  tickets: CinemaTicket[];

  @ApiProperty({ type: FilmPerson, description: 'Данные пользователя' })
  @Field(() => FilmPerson)
  @Prop({ required: true })
  person: FilmPerson;

  @ApiProperty({
    description: 'Статус заказа',
    example: CinemaOrderStatus.PAID,
    enum: CinemaOrderStatus,
    enumName: 'CinemaOrderStatus'
  })
  @Field(() => CinemaOrderStatus)
  @Prop({ required: true, default: CinemaOrderStatus.PAID })
  status: CinemaOrderStatus;
}

export type CinemaOrderDocument = CinemaOrder & Document;
export const CinemaOrderSchema = SchemaFactory.createForClass(CinemaOrder);
