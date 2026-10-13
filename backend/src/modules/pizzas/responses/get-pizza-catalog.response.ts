import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '@/utils/base';

import { PizzaProduct } from '../pizza.entity';

@ObjectType()
export class GetPizzaCatalogResponse extends BaseResponse {
  @ApiProperty({ type: [PizzaProduct], description: 'Каталог продуктов' })
  @Field(() => [PizzaProduct])
  catalog: PizzaProduct[];
}
