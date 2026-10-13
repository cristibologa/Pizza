import { Field, GraphQLISODateTime, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { PizzaAddress, PizzaCommission, PizzaOrderedItem, PizzaPerson } from '../../entities';
import { PizzaStatus } from './pizza-orders.enums';

@InputType('PizzaOrderInput')
@ObjectType()
export class PizzaOrder {
  @ApiProperty({ type: String, description: 'ID заказа' })
  @Field(() => ID)
  _id: Types.ObjectId;

  @ApiProperty({ type: Date, description: 'Дата создания заказа' })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Дата обновления заказа' })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @ApiProperty({ type: [PizzaOrderedItem], description: 'Позиции заказа' })
  @Field(() => [PizzaOrderedItem])
  items: PizzaOrderedItem[];

  @ApiProperty({ type: Number, description: 'Сумма позиций без доставки' })
  @Field(() => Number)
  itemsPrice: number;

  @ApiProperty({ type: PizzaCommission, description: 'Комиссия за доставку (0 — бесплатно)' })
  @Field(() => PizzaCommission)
  commission: PizzaCommission;

  @ApiProperty({ type: Number, description: 'Итоговая сумма (позиции + доставка)' })
  @Field(() => Number)
  totalPrice: number;

  @ApiProperty({ type: PizzaPerson, description: 'Данные пользователя' })
  @Field(() => PizzaPerson)
  person: PizzaPerson;

  @ApiProperty({ type: PizzaAddress, description: 'Адрес доставки' })
  @Field(() => PizzaAddress)
  receiverAddress: PizzaAddress;

  @ApiProperty({
    description: 'Статус заказа',
    example: PizzaStatus.AWAITING_PAYMENT,
    enum: PizzaStatus,
    enumName: 'PizzaStatus'
  })
  @Field(() => PizzaStatus)
  status: PizzaStatus;

  @ApiProperty({ type: Boolean, description: 'Можно ли отменить заказ' })
  @Field(() => Boolean)
  cancellable: boolean;

  @ApiProperty({ type: String, description: 'ID связанной транзакции', nullable: true })
  @Field(() => String, { nullable: true })
  transactionId?: string | null;
}
