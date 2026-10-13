import type { FastifyRequest } from 'fastify';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import type { User } from '@/modules/users';

import { AuthorizedOnlyGuard } from '@/modules/auth';
import { AuthService, BaseResolver } from '@/utils/services';

import {
  GetGameDto,
  GetGameOrderDto,
  GetGamesDto,
  GetPriceVariantsDto,
  GetRegionsDto,
  SearchGamesDto
} from './dto';
import {
  GameOrderResponse,
  GameOrdersResponse,
  GameResponse,
  GameSearchResponse,
  GamesPaginatedResponse,
  PriceVariantsResponse,
  RegionsResponse
} from './games.model';
import { GamesService } from './games.service';
import { GameOrderService } from './modules';

@Resolver('🎮 games query')
@Resolver()
export class GamesQuery extends BaseResolver {
  constructor(
    private readonly gamesService: GamesService,
    private readonly gameOrderService: GameOrderService,
    private readonly authService: AuthService
  ) {
    super();
  }

  @Query(() => GamesPaginatedResponse)
  getGames(@Args('input') getGamesSearchDto: GetGamesDto): GamesPaginatedResponse {
    const games = this.gamesService.getFilteredGames(getGamesSearchDto);
    const paginatedGames = this.gamesService.getPagination({
      items: games,
      page: getGamesSearchDto.page,
      limit: getGamesSearchDto.limit
    });

    return this.wrapSuccess(paginatedGames);
  }

  @Query(() => GameSearchResponse)
  searchGames(@Args('input') searchGamesDto: SearchGamesDto): GameSearchResponse {
    const games = this.gamesService.searchAutocomplete(searchGamesDto);
    return this.wrapSuccess({ games });
  }

  @Query(() => GameResponse)
  getGame(@Args('input') getGameDto: GetGameDto): GameResponse {
    const game = this.gamesService.getGame(getGameDto.slug);

    if (!game) {
      throw new NotFoundException(this.wrapFail('Игра не найдена'));
    }

    return this.wrapSuccess({ game });
  }

  @Query(() => RegionsResponse)
  getRegions(@Args('input') getRegionsDto: GetRegionsDto): RegionsResponse {
    const regions = this.gamesService.getRegions(getRegionsDto);

    if (!regions) {
      throw new NotFoundException(this.wrapFail('Регионы не найдены'));
    }

    return this.wrapSuccess({ regions });
  }

  @Query(() => PriceVariantsResponse)
  getEditions(@Args('input') getPriceVariantsDto: GetPriceVariantsDto): PriceVariantsResponse {
    const priceVariants = this.gamesService.getPriceVariant(getPriceVariantsDto);

    if (!priceVariants) {
      throw new NotFoundException(this.wrapFail('Варианты не найдены'));
    }

    return this.wrapSuccess({ priceVariants });
  }

  @Query(() => GameOrdersResponse)
  @AuthorizedOnly()
  async getGameOrders(@Context() context: { req: FastifyRequest }): Promise<GameOrdersResponse> {
    const token = context.req.headers.authorization.split(' ')[1];
    const decodedJwtAccessToken = (await this.authService.decode(token)) as User;

    if (!decodedJwtAccessToken) {
      throw new BadRequestException(this.wrapFail('Некорректный токен авторизации'));
    }

    const orders = await this.gameOrderService.find({
      $or: [{ 'person.phone': decodedJwtAccessToken.phone }]
    });

    return this.wrapSuccess({ orders });
  }

  @Query(() => GameOrderResponse)
  @AuthorizedOnly()
  async getGameOrder(
    @Args('input') getGameOrderDto: GetGameOrderDto,
    @Context() context: { req: FastifyRequest }
  ): Promise<GameOrderResponse> {
    const token = context.req.headers.authorization.split(' ')[1];
    const decodedJwtAccessToken = (await this.authService.decode(token)) as User;

    if (!decodedJwtAccessToken) {
      throw new BadRequestException(this.wrapFail('Некорректный токен авторизации'));
    }

    const order = await this.gameOrderService.findOne({
      _id: getGameOrderDto.orderId,
      $or: [{ 'person.phone': decodedJwtAccessToken.phone }]
    });

    if (!order) {
      throw new NotFoundException(this.wrapFail('Заказ не найден'));
    }

    return this.wrapSuccess({ order });
  }
}
