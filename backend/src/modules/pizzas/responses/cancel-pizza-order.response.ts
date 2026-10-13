import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '@/utils/base';

import { PizzaOrder } from '../modules/pizza-orders';

@ObjectType()
export class CancelPizzaOrderResponse extends BaseResponse {
  @ApiProperty({ type: PizzaOrder, description: 'Отменённый заказ' })
  @Field(() => PizzaOrder)
  order: PizzaOrder;
}
