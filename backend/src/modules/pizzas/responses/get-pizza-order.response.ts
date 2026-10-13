import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '@/utils/base';

import { PizzaOrder } from '../modules/pizza-orders';

@ObjectType()
export class GetPizzaOrderResponse extends BaseResponse {
  @ApiProperty({ type: PizzaOrder, description: 'Доставки' })
  @Field(() => PizzaOrder)
  order: PizzaOrder;
}
