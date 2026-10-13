import type { Document } from 'mongoose';

import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { DeliveryType, Region } from '../../constants';

@InputType('GameOrderPersonInput')
@ObjectType()
export class GameOrderPerson {
  @ApiProperty({ description: 'Телефон', example: '79990001122' })
  @Field(() => String)
  phone: string;

  @ApiProperty({ description: 'Email', example: 'user@mail.com' })
  @Field(() => String)
  email: string;

  @ApiProperty({
    description: 'Ссылка на приглашение',
    example: 'https://example.com/invite',
    required: false
  })
  @Field(() => String, { nullable: true })
  inviteLink?: string;
}

@InputType('GameOrderSnapshotInput')
@ObjectType()
export class GameOrderSnapshot {
  @ApiProperty({ description: 'Slug игры', example: 'battlefield-2042' })
  @Field(() => String)
  slug: string;

  @ApiProperty({ description: 'Название игры', example: 'Battlefield 2042' })
  @Field(() => String)
  name: string;

  @ApiProperty({ description: 'Картинка игры', example: '/static/images/pizza/1.webp' })
  @Field(() => String)
  image: string;

  @ApiProperty({ description: 'Регион', example: Region.EUROPE, enum: Region, enumName: 'Region' })
  @Field(() => Region)
  region: Region;

  @ApiProperty({ description: 'Текущая цена', example: 968 })
  @Field(() => Number)
  price: number;

  @ApiProperty({
    description: 'Способ получения',
    example: DeliveryType.STEAM_KEY,
    enum: DeliveryType,
    enumName: 'DeliveryType'
  })
  @Field(() => DeliveryType)
  deliveryType: DeliveryType;

  @ApiProperty({ description: 'Издание', example: 'Deluxe' })
  @Field(() => String)
  edition: string;
}

@InputType('GameOrderInput')
@ObjectType()
@Schema({
  collection: 'games/order',
  minimize: false,
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
export class GameOrder {
  @ApiProperty({ type: String, description: 'ID заказа' })
  @Field(() => String)
  _id: Types.ObjectId;

  @ApiProperty({ type: GameOrderPerson, description: 'Данные покупателя' })
  @Field(() => GameOrderPerson)
  @Prop({ required: true })
  person: GameOrderPerson;

  @ApiProperty({ type: GameOrderSnapshot, description: 'Снимок игры на момент заказа' })
  @Field(() => GameOrderSnapshot)
  @Prop({ required: true })
  gameSnapshot: GameOrderSnapshot;

  @ApiProperty({
    description: 'Сгенерированный игровой ключ',
    example: 'XXXX-YYYY-ZZZZ',
    required: false
  })
  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  gameKey?: string;
}

export type GameOrderDocument = GameOrder & Document;
export const GameOrderSchema = SchemaFactory.createForClass(GameOrder);
