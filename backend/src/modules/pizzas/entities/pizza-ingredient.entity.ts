import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PizzaIngredientType } from '../pizzas.enums';

@InputType('PizzaIngredientInput')
@ObjectType()
export class PizzaIngredient {
  @ApiProperty({
    description: 'Идентификатор ингредиента',
    example: PizzaIngredientType.PINEAPPLE,
    enum: PizzaIngredientType,
    enumName: 'PizzaIngredientType'
  })
  @Field(() => PizzaIngredientType)
  type: PizzaIngredientType;

  @ApiProperty({ description: 'Цена ингредиента' })
  @Field(() => Number)
  price: number;

  @ApiProperty({ description: 'Изображение ингредиента' })
  @Field(() => String)
  img: string;
}
