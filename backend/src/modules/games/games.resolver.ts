import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import type { User } from '@/modules/users';

import { CurrentUser } from '@/utils/decorators';
import { AuthorizedOnly } from '@/utils/guards';

import {
  CreateGameOrderDto,
  GetGameDto,
  GetGameOrderDto,
  GetGamePaidOrderDto,
  GetGamePriceVariantsDto,
  GetGameRegionsDto,
  GetGamesSearchDto,
  SearchGamesDto
} from './dto';
import { GameFiltered } from './game.entity';
import {
  CreateGameOrderResponse,
  GameOrderResponse,
  GameOrdersResponse,
  GamePriceVariantsResponse,
  GameRegionsResponse,
  GameResponse,
  GameSearchResponse,
  GamesPaginatedResponse
} from './games.model';
import { GamesService } from './games.service';

@Resolver(() => GameFiltered)
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Query(() => GamesPaginatedResponse, { description: 'Получить игры' })
  async getGames(@Args() getGamesSearchDto: GetGamesSearchDto): Promise<GamesPaginatedResponse> {
    return this.gamesService.getGames(getGamesSearchDto);
  }

  @Query(() => GameSearchResponse, { description: 'Поиск по играм' })
  async searchGames(@Args() searchGamesDto: SearchGamesDto): Promise<GameSearchResponse> {
    return this.gamesService.searchGames(searchGamesDto);
  }

  @Query(() => GameResponse, { description: 'Получить игру' })
  async getGame(@Args() getGameDto: GetGameDto): Promise<GameResponse> {
    return this.gamesService.getGame(getGameDto);
  }

  @Query(() => GameRegionsResponse, { description: 'Получить регионы' })
  async getGameRegions(@Args() getGameRegionsDto: GetGameRegionsDto): Promise<GameRegionsResponse> {
    return this.gamesService.getGameRegions(getGameRegionsDto);
  }

  @Query(() => GamePriceVariantsResponse, { description: 'Получить варианты цен' })
  async getGamePriceVariants(
    @Args() getGamePriceVariantsDto: GetGamePriceVariantsDto
  ): Promise<GamePriceVariantsResponse> {
    return this.gamesService.getGamePriceVariants(getGamePriceVariantsDto);
  }

  @Mutation(() => CreateGameOrderResponse, {
    description: 'Создать заказ игры и транзакцию для оплаты'
  })
  async createGameOrder(
    @Args('input') createGameOrderDto: CreateGameOrderDto
  ): Promise<CreateGameOrderResponse> {
    return this.gamesService.createGameOrder(createGameOrderDto);
  }

  @Query(() => GameOrdersResponse, { description: 'Получить все заказы игр' })
  @AuthorizedOnly()
  async getGameOrders(@CurrentUser() user: User): Promise<GameOrdersResponse> {
    return this.gamesService.getGameOrders(user.phone);
  }

  @Query(() => GameOrderResponse, { description: 'Получить заказ игры' })
  @AuthorizedOnly()
  async getGameOrder(
    @Args() getGameOrderDto: GetGameOrderDto,
    @CurrentUser() user: User
  ): Promise<GameOrderResponse> {
    return this.gamesService.getGameOrder(getGameOrderDto.orderId, user.phone);
  }

  @Query(() => GameOrderResponse, {
    description: 'Получить оплаченный заказ игры по одноразовому токену'
  })
  async getGamePaidOrder(
    @Args() getGamePaidOrderDto: GetGamePaidOrderDto
  ): Promise<GameOrderResponse> {
    return this.gamesService.getGamePaidOrder(getGamePaidOrderDto);
  }
}
