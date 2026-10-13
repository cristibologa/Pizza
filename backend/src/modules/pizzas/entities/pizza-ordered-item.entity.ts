import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Types } from 'mongoose';

import { PizzaCategory, PizzaIngredientType, PizzaOptionType, PizzaSize } from '../pizzas.enums';

@InputType('PizzaOrderedItemInput')
@ObjectType()
export class PizzaOrderedItem {
  @ApiProperty({ description: 'Идентификатор продукта' })
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Категория продукта',
    example: PizzaCategory.PIZZA,
    enum: PizzaCategory,
    enumName: 'PizzaCategory'
  })
  @Field(() => PizzaCategory)
  @IsEnum(PizzaCategory)
  category: PizzaCategory;

  @ApiProperty({ description: 'Количество одинаковых позиций', example: 1, default: 1 })
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  quantity: number = 1;

  @ApiProperty({
    description: 'Размер',
    example: PizzaSize.SMALL,
    enum: PizzaSize,
    required: false,
    enumName: 'PizzaSize'
  })
  @Field(() => PizzaSize, { nullable: true })
  @IsEnum(PizzaSize)
  @IsOptional()
  size?: PizzaSize;

  @ApiProperty({
    description: 'Выбранная доп-опция: корка, сливки и т.д.',
    example: PizzaOptionType.CRUST_THIN,
    enum: PizzaOptionType,
    required: false,
    enumName: 'PizzaOptionType'
  })
  @Field(() => PizzaOptionType, { nullable: true })
  @IsEnum(PizzaOptionType)
  @IsOptional()
  option?: PizzaOptionType;

  @ApiProperty({
    type: [PizzaIngredientType],
    description: 'Доп-ингредиенты',
    enum: PizzaIngredientType,
    required: false,
    enumName: 'PizzaIngredientType'
  })
  @Field(() => [PizzaIngredientType], { nullable: true })
  @IsArray()
  @IsEnum(PizzaIngredientType, { each: true })
  @IsOptional()
  toppings?: PizzaIngredientType[];
}
