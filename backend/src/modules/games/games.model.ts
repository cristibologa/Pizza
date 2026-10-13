import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { Transaction } from '@/modules/transactions';
import { BaseResponse } from '@/utils/base';

import { GameRegion } from './constants';
import { GameDetailed, GameFiltered, GamePaginationMeta, GamePriceVariant } from './game.entity';
import { GameOrder } from './modules';

@ObjectType()
export class GamesPaginatedResponse extends BaseResponse {
  @ApiProperty({ type: [GameFiltered], description: 'Список игр' })
  @Field(() => [GameFiltered])
  games: GameFiltered[];

  @ApiProperty({ type: GamePaginationMeta, description: 'Пагинация' })
  @Field(() => GamePaginationMeta)
  meta: GamePaginationMeta;
}

@ObjectType()
export class GameResponse extends BaseResponse {
  @ApiProperty({ type: GameDetailed, description: 'Игра' })
  @Field(() => GameDetailed)
  game: GameDetailed;
}

@ObjectType()
export class GameSearchResponse extends BaseResponse {
  @ApiProperty({ type: [GameFiltered], description: 'Результаты поиска игр' })
  @Field(() => [GameFiltered])
  games: GameFiltered[];
}

@ObjectType()
export class GameRegionsResponse extends BaseResponse {
  @ApiProperty({
    description: 'Доступные регионы',
    enum: GameRegion,
    isArray: true,
    enumName: 'GameRegion'
  })
  @Field(() => [GameRegion])
  regions: GameRegion[];
}

@ObjectType()
export class GamePriceVariantsResponse extends BaseResponse {
  @ApiProperty({ type: [GamePriceVariant], description: 'Варианты цен для изданий' })
  @Field(() => [GamePriceVariant])
  priceVariants: GamePriceVariant[];
}

@ObjectType()
export class CreateGameOrderResponse extends BaseResponse {
  @ApiProperty({ type: GameOrder, description: 'Заказ на игру (ожидает оплаты)' })
  @Field(() => GameOrder)
  order: GameOrder;

  @ApiProperty({ type: Transaction, description: 'Транзакция для оплаты' })
  @Field(() => Transaction)
  transaction: Transaction;
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
