import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { PizzaIngredient, PizzaItemSize, PizzaOption } from './entities';
import { PizzaCategory } from './pizzas.enums';

@InputType('PizzaProductInput')
@ObjectType()
export class PizzaProduct {
  @ApiProperty({ type: String, description: 'ID продукта' })
  @Field(() => ID)
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Категория продукта',
    example: PizzaCategory.PIZZA,
    enum: PizzaCategory,
    enumName: 'PizzaCategory'
  })
  @Field(() => PizzaCategory)
  category: PizzaCategory;

  @ApiProperty({ description: 'Название', example: 'Двойной цыпленок' })
  @Field(() => String)
  name: string;

  @ApiProperty({ description: 'Описание' })
  @Field(() => String)
  description: string;

  @ApiProperty({ description: 'Изображение' })
  @Field(() => String)
  img: string;

  @ApiProperty({ type: [PizzaItemSize], description: 'Доступные размеры' })
  @Field(() => [PizzaItemSize])
  sizes: PizzaItemSize[];

  @ApiProperty({
    type: [PizzaOption],
    description: 'Доступные доп-опции',
    required: false
  })
  @Field(() => [PizzaOption], { nullable: true })
  options?: PizzaOption[];

  @ApiProperty({
    type: [PizzaIngredient],
    description: 'Состав / доступные доп-ингредиенты',
    required: false
  })
  @Field(() => [PizzaIngredient], { nullable: true })
  ingredients?: PizzaIngredient[];

  @ApiProperty({ description: 'Калории' })
  @Field(() => Number)
  calories: number;

  @ApiProperty({ description: 'Белки' })
  @Field(() => String)
  protein: string;

  @ApiProperty({ description: 'Жиры' })
  @Field(() => String)
  totalFat: string;

  @ApiProperty({ description: 'Углеводы' })
  @Field(() => String)
  carbohydrates: string;

  @ApiProperty({ description: 'Натрий' })
  @Field(() => String)
  sodium: string;

  @ApiProperty({ type: [String], description: 'Аллергены' })
  @Field(() => [String])
  allergens: string[];

  @ApiProperty({ description: 'Вегетарианский' })
  @Field(() => Boolean)
  isVegetarian: boolean;

  @ApiProperty({ description: 'Без глютена' })
  @Field(() => Boolean)
  isGlutenFree: boolean;

  @ApiProperty({ description: 'Новинка' })
  @Field(() => Boolean)
  isNovelty: boolean;

  @ApiProperty({ description: 'Хит' })
  @Field(() => Boolean)
  isHit: boolean;
}
