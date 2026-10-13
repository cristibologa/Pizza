import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';

import { PizzaOrderedItem } from '../entities';

@InputType()
export class CalculatePizzaOrderDto {
  @ApiProperty({ type: [PizzaOrderedItem], description: 'Позиции корзины' })
  @Field(() => [PizzaOrderedItem])
  @Type(() => PizzaOrderedItem)
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  items: PizzaOrderedItem[];
}
