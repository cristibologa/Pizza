import { Field, GraphQLISODateTime, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { GameDeliveryType, GameRegion } from '../../constants';
import { GameOrderStatus } from './game-order.enums';

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

@InputType('GameOrderInput')
@ObjectType()
export class GameOrder {
  @ApiProperty({ type: String, description: 'ID заказа' })
  @Field(() => ID)
  _id: Types.ObjectId;

  @ApiProperty({ type: Date, description: 'Дата создания заказа' })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Дата обновления заказа' })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @ApiProperty({ type: GameOrderPerson, description: 'Данные покупателя' })
  @Field(() => GameOrderPerson)
  person: GameOrderPerson;

  @ApiProperty({ description: 'Slug игры', example: 'battlefield-2042' })
  @Field(() => String)
  gameSlug: string;

  @ApiProperty({ description: 'Название игры', example: 'Battlefield 2042' })
  @Field(() => String)
  gameName: string;

  @ApiProperty({
    description: 'Изображение игры',
    example: '/games/battlefield-2042/cover.webp'
  })
  @Field(() => String)
  gameImage: string;

  @ApiProperty({
    description: 'Регион',
    example: GameRegion.EUROPE,
    enum: GameRegion,
    enumName: 'GameRegion'
  })
  @Field(() => GameRegion)
  region: GameRegion;

  @ApiProperty({ description: 'Цена заказа', example: 968 })
  @Field(() => Number)
  price: number;

  @ApiProperty({
    description: 'Способ получения',
    example: GameDeliveryType.STEAM_KEY,
    enum: GameDeliveryType,
    enumName: 'GameDeliveryType'
  })
  @Field(() => GameDeliveryType)
  deliveryType: GameDeliveryType;

  @ApiProperty({ description: 'Издание', example: 'Deluxe' })
  @Field(() => String)
  edition: string;

  @ApiProperty({
    description: 'Статус заказа',
    example: GameOrderStatus.AWAITING_PAYMENT,
    enum: GameOrderStatus,
    enumName: 'GameOrderStatus'
  })
  @Field(() => GameOrderStatus)
  status: GameOrderStatus;

  @ApiProperty({
    type: String,
    description: 'Сгенерированный игровой ключ (выдаётся после оплаты)',
    example: 'XXXX-YYYY-ZZZZ',
    nullable: true,
    required: false
  })
  @Field(() => String, { nullable: true })
  gameKey?: string | null;

  @ApiProperty({ type: String, description: 'ID связанной транзакции', nullable: true })
  @Field(() => String, { nullable: true })
  transactionId?: string | null;
}
