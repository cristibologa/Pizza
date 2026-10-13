import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType('PizzaCommissionInput')
@ObjectType()
export class PizzaCommission {
  @ApiProperty({ description: 'Сумма комиссии', example: 149 })
  @Field(() => Number)
  amount: number;

  @ApiProperty({ description: 'Валюта', example: 'RUB' })
  @Field(() => String)
  currency: string;
}
