import type { Document } from 'mongoose';

import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export enum CinemaTicketStatus {
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

registerEnumType(CinemaTicketStatus, {
  name: 'CinemaTicketStatus'
});

@InputType('CinemaTicketSeanceInput')
@ObjectType()
export class CinemaTicketSeance {
  @ApiProperty({ description: 'Дата сеанса', example: '29.06.23' })
  @Field(() => String)
  date: string;

  @ApiProperty({ description: 'Время сеанса', example: '10:00' })
  @Field(() => String)
  time: string;
}

@InputType('CinemaTicketInput')
@ObjectType()
@Schema({
  collection: 'cinema/tickets',
  minimize: false,
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
export class CinemaTicket {
  @ApiProperty({ type: String, description: 'ID билета' })
  @Field(() => String)
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Идентификатор фильма' })
  @Field(() => String)
  @Prop({ required: true })
  filmId: string;

  @ApiProperty({ description: 'Идентификатор заказа' })
  @Field(() => String)
  @Prop({ required: true })
  orderId: string;

  @ApiProperty({ description: 'Ряд', example: 1 })
  @Field(() => Number)
  @Prop({ required: true })
  row: number;

  @ApiProperty({ description: 'Место', example: 1 })
  @Field(() => Number)
  @Prop({ required: true })
  column: number;

  @ApiProperty({ type: CinemaTicketSeance, description: 'Сеанс фильма' })
  @Field(() => CinemaTicketSeance)
  @Prop({ required: true })
  seance: CinemaTicketSeance;

  @ApiProperty({ description: 'Телефон', example: '89990009999' })
  @Field(() => String)
  @Prop({ required: true })
  phone: string;

  @ApiProperty({
    description: 'Статус билета',
    example: CinemaTicketStatus.PAID,
    enum: CinemaTicketStatus,
    enumName: 'CinemaTicketStatus'
  })
  @Field(() => CinemaTicketStatus)
  @Prop({ required: true })
  status: string;
}

export type CinemaTicketDocument = CinemaTicket & Document;
export const CinemaTicketSchema = SchemaFactory.createForClass(CinemaTicket);
