import type { FastifyRequest } from 'fastify';

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { User } from '@/modules/users';

import { UsersService } from '@/modules/users';
import { AuthorizedOnlyGuard } from '@/modules/auth';
import { AuthService, BaseResolver } from '@/utils/services';

import { DeliveryType, GameFilter, GameGenre, GameView, Region } from './constants';
import {
  CreateGameOrderDto,
  GetGameDto,
  GetGameOrderDto,
  GetGamesDto,
  GetPriceVariantsDto,
  GetRegionsDto,
  SearchGamesDto
} from './dto';
import {
  CreateGameOrderResponse,
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

@ApiTags('🎮 games')
@Controller('/games')
export class GamesController extends BaseResolver {
  constructor(
    private readonly gamesService: GamesService,
    private readonly gameOrderService: GameOrderService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {
    super();
  }

  @ApiOperation({ summary: 'Получить игры' })
  @ApiQuery({
    description: 'Дополнительные фильтры',
    example: [GameFilter.DISCOUNT, GameFilter.DLC],
    enum: GameFilter,
    isArray: true,
    required: false,
    enumName: 'GameFilter',
    name: 'filter'
  })
  @ApiQuery({
    description: 'Предустановленный вид выборки',
    example: GameView.POPULAR,
    enum: GameView,
    required: false,
    enumName: 'GameView',
    name: 'view'
  })
  @ApiQuery({
    description: 'Жанр',
    example: [GameGenre.ACTION, GameGenre.RPG],
    enum: GameGenre,
    isArray: true,
    required: false,
    enumName: 'GameGenre',
    name: 'genre'
  })
  @ApiQuery({ type: Number, description: 'Страница', required: false, name: 'page' })
  @ApiQuery({ type: Number, description: 'Лимит', required: false, name: 'limit' })
  @ApiResponse({ type: GamesPaginatedResponse, status: 200 })
  @Get('/info')
  getGames(@Query() getGamesSearchDto: GetGamesDto): GamesPaginatedResponse {
    const games = this.gamesService.getFilteredGames(getGamesSearchDto);

    const paginatedGames = this.gamesService.getPagination({
      items: games,
      page: getGamesSearchDto.page,
      limit: getGamesSearchDto.limit
    });

    return this.wrapSuccess(paginatedGames);
  }

  @ApiOperation({ summary: 'Поиск по играм' })
  @ApiQuery({ type: String, description: 'Строка поиска', required: true, name: 'search' })
  @ApiQuery({ type: Number, description: 'Лимит', required: false, name: 'limit' })
  @ApiResponse({ type: GameSearchResponse, status: 200 })
  @Get('/search')
  searchGames(@Query() searchGamesDto: SearchGamesDto): GameSearchResponse {
    const games = this.gamesService.searchAutocomplete(searchGamesDto);
    return this.wrapSuccess({ games });
  }

  @ApiOperation({ summary: 'Получить игру' })
  @ApiResponse({ type: GameResponse, status: 200 })
  @Get('/info/:slug')
  getGame(@Param() getGameDto: GetGameDto): GameResponse {
    const game = this.gamesService.getGame(getGameDto.slug);

    if (!game) {
      throw new NotFoundException(this.wrapFail('Игра не найдена'));
    }

    return this.wrapSuccess({ game });
  }

  @ApiOperation({ summary: 'Получить регионы' })
  @ApiQuery({
    type: String,
    description: 'Slug игры',
    required: true,
    name: 'slug'
  })
  @ApiQuery({
    description: 'Тип доставки',
    example: DeliveryType.STEAM_GIFT,
    enum: DeliveryType,
    required: true,
    enumName: 'DeliveryType',
    name: 'deliveryType'
  })
  @ApiResponse({ type: RegionsResponse, status: 200 })
  @Get('/regions')
  getRegions(@Query() getRegionsDto: GetRegionsDto): RegionsResponse {
    const regions = this.gamesService.getRegions(getRegionsDto);

    if (!regions) {
      throw new NotFoundException(this.wrapFail('Регионы не найдены'));
    }

    return this.wrapSuccess({ regions });
  }

  @ApiOperation({ summary: 'Получить варианты цен' })
  @ApiQuery({
    type: String,
    description: 'Slug игры',
    required: true,
    name: 'slug'
  })
  @ApiQuery({
    description: 'Тип доставки',
    example: DeliveryType.STEAM_GIFT,
    enum: DeliveryType,
    required: true,
    enumName: 'DeliveryType',
    name: 'deliveryType'
  })
  @ApiQuery({
    description: 'Регион',
    example: Region.RU,
    enum: Region,
    required: true,
    enumName: 'Region',
    name: 'region'
  })
  @ApiResponse({ type: PriceVariantsResponse, status: 200 })
  @Get('/price-variants')
  getPriceVariants(@Query() getPriceVariantsDto: GetPriceVariantsDto): PriceVariantsResponse {
    const priceVariants = this.gamesService.getPriceVariant(getPriceVariantsDto);

    if (!priceVariants) {
      throw new NotFoundException(this.wrapFail('Варианты не найдены'));
    }

    return this.wrapSuccess({ priceVariants });
  }

  @ApiOperation({ summary: 'Купить игру и получить ключ' })
  @ApiResponse({ type: CreateGameOrderResponse, status: 200 })
  @Post('/order')
  async createGameOrder(
    @Body() createGameOrderDto: CreateGameOrderDto
  ): Promise<CreateGameOrderResponse> {
    const game = this.gamesService.findGame(createGameOrderDto.gameSlug);

    if (!game) {
      throw new NotFoundException(this.wrapFail('Игра не найдена'));
    }

    let user = await this.usersService.findOne({ phone: createGameOrderDto.person.phone });

    if (!user) {
      user = await this.usersService.create({
        phone: createGameOrderDto.person.phone
      });
    }

    await this.usersService.findOneAndUpdate(
      { phone: user.phone },
      {
        $set: {
          email: createGameOrderDto.person.email
        }
      }
    );

    const priceVariant = game.priceVariants.find(
      (variant) =>
        createGameOrderDto.deliveryType === variant.deliveryType &&
        createGameOrderDto.edition === variant.edition &&
        createGameOrderDto.region === variant.region
    );

    if (
      priceVariant?.deliveryType === DeliveryType.STEAM_GIFT &&
      !createGameOrderDto.person.inviteLink
    ) {
      throw new BadRequestException(
        this.wrapFail('При заказе Steam Gift необходимо указать ссылку приглашения')
      );
    }

    if (!priceVariant) {
      throw new NotFoundException(this.wrapFail('Вариант цены не найден'));
    }

    const order = await this.gameOrderService.create({
      person: createGameOrderDto.person,
      gameSnapshot: {
        deliveryType: priceVariant.deliveryType,
        edition: priceVariant.edition,
        price: priceVariant.price,
        region: priceVariant.region,
        slug: game.slug,
        name: game.name,
        image: game.image
      },
      ...(priceVariant.deliveryType !== DeliveryType.STEAM_GIFT && {
        gameKey: this.gameOrderService.generateGameKey()
      })
    });

    return this.wrapSuccess({ order });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все заказы игр' })
  @ApiResponse({ type: GameOrdersResponse, status: 200 })
  @Get('/orders')
  @AuthorizedOnly()
  async getGameOrders(@Req() request: FastifyRequest): Promise<GameOrdersResponse> {
    const token = request.headers.authorization.split(' ')[1];
    const decodedJwtAccessToken = (await this.authService.decode(token)) as User;

    if (!decodedJwtAccessToken) {
      throw new BadRequestException(this.wrapFail('Некорректный токен авторизации'));
    }

    const orders = await this.gameOrderService.find({
      $or: [{ 'person.phone': decodedJwtAccessToken.phone }]
    });

    return this.wrapSuccess({ orders });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить заказ игры' })
  @ApiResponse({ type: GameOrderResponse, status: 200 })
  @Get('/orders/:orderId')
  @AuthorizedOnly()
  async getGameOrder(
    @Param() getGameOrderDto: GetGameOrderDto,
    @Req() request: FastifyRequest
  ): Promise<GameOrderResponse> {
    const token = request.headers.authorization.split(' ')[1];
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
