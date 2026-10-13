import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PizzaOptionType } from '../pizzas.enums';

@InputType('PizzaOptionInput')
@ObjectType()
export class PizzaOption {
  @ApiProperty({
    description: 'Идентификатор опции',
    example: PizzaOptionType.CRUST_THIN,
    enum: PizzaOptionType,
    enumName: 'PizzaOptionType'
  })
  @Field(() => PizzaOptionType)
  type: PizzaOptionType;

  @ApiProperty({ description: 'Цена опции' })
  @Field(() => Number)
  price: number;
}
