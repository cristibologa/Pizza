import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { BaseResponse } from '@/utils/base';

import { PizzaCommission } from '../entities';

@ObjectType()
export class CalculatedItem {
  @ApiProperty({ type: String, description: 'ID продукта' })
  @Field(() => ID)
  productId: Types.ObjectId;

  @ApiProperty({ description: 'Название' })
  @Field(() => String)
  name: string;

  @ApiProperty({ description: 'Количество' })
  @Field(() => Int)
  quantity: number;

  @ApiProperty({ description: 'Цена одной позиции' })
  @Field(() => Number)
  unitPrice: number;

  @ApiProperty({ description: 'Итого по позиции' })
  @Field(() => Number)
  totalPrice: number;
}

@ObjectType()
export class CalculateOrderResponse extends BaseResponse {
  @ApiProperty({ type: [CalculatedItem], description: 'Позиции с ценами' })
  @Field(() => [CalculatedItem])
  items: CalculatedItem[];

  @ApiProperty({ description: 'Сумма позиций без доставки' })
  @Field(() => Number)
  itemsPrice: number;

  @ApiProperty({ type: PizzaCommission, description: 'Комиссия за доставку' })
  @Field(() => PizzaCommission)
  commission: PizzaCommission;

  @ApiProperty({ description: 'Итоговая сумма' })
  @Field(() => Number)
  totalPrice: number;
}
