import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '@/utils/services';

import { Region } from './constants';
import { DetailedGame, FilteredGame, GamesPaginationMeta, PriceVariant } from './entities';
import { GameOrder } from './modules';

@ObjectType()
export class GamesPaginatedResponse extends BaseResponse {
  @ApiProperty({ type: [FilteredGame], description: 'Список игр' })
  @Field(() => [FilteredGame])
  games: FilteredGame[];

  @ApiProperty({ type: GamesPaginationMeta, description: 'Пагинация' })
  @Field(() => GamesPaginationMeta)
  meta: GamesPaginationMeta;
}

@ObjectType()
export class GameResponse extends BaseResponse {
  @ApiProperty({ type: DetailedGame, description: 'Игра' })
  @Field(() => DetailedGame)
  game: DetailedGame;
}

@ObjectType()
export class GameSearchResponse extends BaseResponse {
  @ApiProperty({ type: [FilteredGame], description: 'Результаты поиска игр' })
  @Field(() => [FilteredGame])
  games: FilteredGame[];
}

@ObjectType()
export class RegionsResponse extends BaseResponse {
  @ApiProperty({
    description: 'Доступные регионы',
    enum: Region,
    isArray: true,
    enumName: 'Region'
  })
  @Field(() => [Region])
  regions: Region[];
}

@ObjectType()
export class PriceVariantsResponse extends BaseResponse {
  @ApiProperty({ type: [PriceVariant], description: 'Варианты цен для изданий' })
  @Field(() => [PriceVariant])
  priceVariants: PriceVariant[];
}

@ObjectType()
export class CreateGameOrderResponse extends BaseResponse {
  @ApiProperty({ type: GameOrder, description: 'Заказ на игру' })
  @Field(() => GameOrder)
  order: GameOrder;
}

@ObjectType()
export class GameOrdersResponse extends BaseResponse {
  @ApiProperty({ type: [GameOrder], description: 'Заказы пользователя' })
  @Field(() => [GameOrder])
  orders: GameOrder[];
}

@ObjectType()
export class GameOrderResponse extends BaseResponse {
  @ApiProperty({ type: GameOrder, description: 'Заказ' })
  @Field(() => GameOrder)
  order: GameOrder;
}
