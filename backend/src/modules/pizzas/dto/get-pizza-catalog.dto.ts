import { ArgsType, Field } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { PizzaCategory } from '../pizzas.enums';

@ArgsType()
export class GetPizzaCatalogDto {
  @ApiPropertyOptional({
    description: 'Фильтр по категории. Если не передан — вернётся весь каталог',
    enum: PizzaCategory,
    enumName: 'PizzaCategory'
  })
  @Field(() => PizzaCategory, { nullable: true })
  @IsEnum(PizzaCategory)
  @IsOptional()
  category?: PizzaCategory;
}
