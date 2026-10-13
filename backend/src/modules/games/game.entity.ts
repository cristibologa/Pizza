import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { GameDeliveryType, GameGenre, GameRegion, GameType } from './constants';

@ObjectType('GamePaginationMeta')
export class GamePaginationMeta {
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

@ObjectType('GameSystemRequirements')
export class GameSystemRequirements {
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

@ObjectType('GamePriceVariant')
export class GamePriceVariant {
  @ApiProperty({
    description: 'Регион',
    example: GameRegion.EUROPE,
    enum: GameRegion,
    enumName: 'GameRegion'
  })
  @Field(() => GameRegion)
  region: GameRegion;

  @ApiProperty({ description: 'Текущая цена', example: 968 })
  @Field(() => Number)
  price: number;

  @ApiProperty({ description: 'Старая цена', example: 2688, required: false })
  @Field(() => Number, { nullable: true })
  oldPrice?: number;

  @ApiProperty({
    description: 'Способ получения',
    example: GameDeliveryType.STEAM_KEY,
    enum: GameDeliveryType,
    enumName: 'GameDeliveryType'
  })
  @Field(() => GameDeliveryType)
  deliveryType: GameDeliveryType;

  @ApiProperty({ description: 'Издание', example: 'Deluxe' })
  @Field(() => String)
  edition: string;
}

export class GameBase {
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

@ObjectType('GameFiltered')
export class GameFiltered extends GameBase {
  @ApiProperty({ type: GamePriceVariant, description: 'Наименьший вариант цены' })
  @Field(() => GamePriceVariant)
  priceVariant: GamePriceVariant;
}

@ObjectType('GameDetailed')
export class GameDetailed extends GameBase {
  @ApiProperty({
    description: 'Способ получения',
    example: [GameDeliveryType.STEAM_KEY, GameDeliveryType.XBOX_KEY, GameDeliveryType.STEAM_GIFT],
    enum: GameDeliveryType,
    isArray: true,
    enumName: 'GameDeliveryType'
  })
  @Field(() => [GameDeliveryType])
  deliveryTypes: GameDeliveryType[];

  @ApiProperty({ description: 'Описание игры', example: 'Онлайн-шутер с масштабными сражениями.' })
  @Field(() => String)
  description: string;

  @ApiProperty({ description: 'Минимальные системные требования' })
  @Field(() => GameSystemRequirements)
  minimumSystemRequirements: GameSystemRequirements;

  @ApiProperty({ description: 'Рекомендуемые системные требования' })
  @Field(() => GameSystemRequirements)
  recommendedSystemRequirements: GameSystemRequirements;

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
