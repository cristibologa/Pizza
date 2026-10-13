import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BodyType, Brand, Color, Steering, Transmission } from '../constants/enums';

@ObjectType()
export class Media {
  @ApiProperty({ example: '/static/images/cars/haval-jolion.webp' })
  @Field(() => String)
  url: string;

  @ApiProperty({ example: true })
  @Field(() => Boolean)
  isCover: boolean;
}

@ObjectType('Car')
export class Car {
  @ApiProperty({ description: 'ID автомобиля', example: '1' })
  @Field(() => String)
  id: string;

  @ApiProperty({ description: 'Название модели', example: 'Model X' })
  @Field(() => String)
  name: string;

  @ApiProperty({
    description: 'Марка автомобиля',
    example: Brand.HAVAL,
    enum: Brand,
    enumName: 'Brand'
  })
  @Field(() => Brand)
  brand: Brand;

  @ApiProperty({ type: [Media] })
  @Field(() => [Media])
  media: Media[];

  @ApiProperty({
    description: 'Тип коробки передач',
    example: Transmission.AUTOMATIC,
    enum: Transmission,
    enumName: 'Transmission'
  })
  @Field(() => Transmission)
  transmission: Transmission;

  @ApiProperty({ description: 'Цена аренды в сутки', example: 15000 })
  @Field(() => Number)
  price: number;

  @ApiProperty({ description: 'Местоположение', example: 'Москва, ул. Пушкина 10' })
  @Field(() => String)
  location: string;

  @ApiProperty({
    description: 'Цвет автомобиля',
    example: Color.BLACK,
    enum: Color,
    enumName: 'Color'
  })
  @Field(() => Color)
  color: Color;

  @ApiProperty({
    description: 'Тип кузова',
    example: BodyType.SEDAN,
    enum: BodyType,
    enumName: 'BodyType'
  })
  @Field(() => BodyType)
  bodyType: BodyType;

  @ApiProperty({
    description: 'Расположение руля',
    example: Steering.LEFT,
    enum: Steering,
    enumName: 'Steering'
  })
  @Field(() => Steering)
  steering: Steering;
}

@ObjectType('CarsPaginationMeta')
export class CarsPaginationMeta {
  @ApiProperty({
    type: Number,
    description: 'Общее количество элементов во всех страницах',
    example: 100
  })
  @Field(() => Number)
  total: number;

  @ApiProperty({
    type: Number,
    description: 'Текущий номер страницы (по умолчанию 1)',
    example: 1
  })
  @Field(() => Number)
  page: number;

  @ApiProperty({
    type: Number,
    description: 'Количество элементов на странице (по умолчанию 10)',
    example: 10
  })
  @Field(() => Number)
  limit: number;

  @ApiProperty({
    type: Number,
    description: 'Общее количество доступных страниц',
    example: 10
  })
  @Field(() => Number)
  totalPages: number;
}
