import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { DeliveryType, GameGenre, GameType, Region } from '../constants';

@ObjectType('GamesPaginationMeta')
export class GamesPaginationMeta {
  @ApiProperty({ description: 'Общее количество элементов', example: 30 })
  @Field(() => Number)
  total: number;

  @ApiProperty({ description: 'Текущая страница', example: 1 })
  @Field(() => Number)
  page: number;

  @ApiProperty({ description: 'Элементов на странице', example: 10 })
  @Field(() => Number)
  limit: number;

  @ApiProperty({ description: 'Количество страниц', example: 3 })
  @Field(() => Number)
  totalPages: number;
}

@ObjectType('SystemRequirements')
export class SystemRequirements {
  @ApiProperty({ description: 'Операционная система', example: 'Windows 10', required: false })
  @Field(() => String, {
    nullable: true
  })
  oc?: string;

  @ApiProperty({ description: 'Процессор', example: 'Intel Core i5-9400F', required: false })
  @Field(() => String, {
    nullable: true
  })
  processor?: string;

  @ApiProperty({ description: 'Оперативная память', example: '16 GB', required: false })
  @Field(() => String, {
    nullable: true
  })
  memory?: string;

  @ApiProperty({ description: 'Видеокарта', example: 'NVIDIA GeForce GTX 1660', required: false })
  @Field(() => String, {
    nullable: true
  })
  graphics?: string;

  @ApiProperty({ description: 'Место на диске', example: '500 GB', required: false })
  @Field(() => String, {
    nullable: true
  })
  storage?: string;
}

@ObjectType('PriceVariant')
export class PriceVariant {
  @ApiProperty({ description: 'Регион', example: Region.EUROPE, enum: Region, enumName: 'Region' })
  @Field(() => Region)
  region: Region;

  @ApiProperty({ description: 'Текущая цена', example: 968 })
  @Field(() => Number)
  price: number;

  @ApiProperty({ description: 'Старая цена', example: 2688, required: false })
  @Field(() => Number, { nullable: true })
  oldPrice?: number;

  @ApiProperty({
    description: 'Способ получения',
    example: DeliveryType.STEAM_KEY,
    enum: DeliveryType,
    enumName: 'DeliveryType'
  })
  @Field(() => DeliveryType)
  deliveryType: DeliveryType;

  @ApiProperty({ description: 'Издание', example: 'Deluxe' })
  @Field(() => String)
  edition: string;
}

export class BaseGame {
  @ApiProperty({ description: 'Slug игры', example: 'battlefield-2042' })
  @Field(() => String)
  slug: string;

  @ApiProperty({ description: 'Название игры', example: 'Battlefield 2042' })
  @Field(() => String)
  name: string;

  @ApiProperty({ description: 'Дата релиза', example: 1637280000 })
  @Field(() => Number)
  releaseDate: number;

  @ApiProperty({
    description: 'Тип',
    example: GameType.GAME,
    enum: GameType,
    enumName: 'GameType'
  })
  @Field(() => GameType)
  type: GameType;

  @ApiProperty({
    description: 'Жанры игры',
    example: [GameGenre.ACTION, GameGenre.RPG],
    enum: GameGenre,
    isArray: true,
    enumName: 'GameGenre'
  })
  @Field(() => [GameGenre])
  genres: GameGenre[];

  @ApiProperty({ description: 'Изображение игры', example: '/static/images/games/cs2.webp' })
  @Field(() => String)
  image: string;
}

@ObjectType('FilteredGame')
export class FilteredGame extends BaseGame {
  @ApiProperty({ type: PriceVariant, description: 'Наименьший вариант цены' })
  @Field(() => PriceVariant)
  priceVariant: PriceVariant;
}

@ObjectType('DetailedGame')
export class DetailedGame extends BaseGame {
  @ApiProperty({
    description: 'Способ получения',
    example: [DeliveryType.STEAM_KEY, DeliveryType.XBOX_KEY, DeliveryType.STEAM_GIFT],
    enum: DeliveryType,
    isArray: true,
    enumName: 'DeliveryType'
  })
  @Field(() => [DeliveryType])
  deliveryTypes: DeliveryType[];

  @ApiProperty({ description: 'Описание игры', example: 'Онлайн-шутер с масштабными сражениями.' })
  @Field(() => String)
  description: string;

  @ApiProperty({ description: 'Минимальные системные требования' })
  @Field(() => SystemRequirements)
  minimumSystemRequirements: SystemRequirements;

  @ApiProperty({ description: 'Рекомендуемые системные требования' })
  @Field(() => SystemRequirements)
  recommendedSystemRequirements: SystemRequirements;

  @ApiProperty({ description: 'Разработчик', example: 'EA Games' })
  @Field(() => String)
  developer: string;

  @ApiProperty({ description: 'Издатель', example: 'Electronic Arts' })
  @Field(() => String)
  publisher: string;

  @ApiProperty({ description: 'Внешний ID (Steam/KupiKod)', example: '1517290' })
  @Field(() => String)
  externalId: string;

  @ApiProperty({ description: 'Скриншоты игры', example: ['/static/images/games/cs2.webp'] })
  @Field(() => [String])
  screenshots: string[];
}
