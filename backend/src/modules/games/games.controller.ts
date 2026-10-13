import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

import type { User } from '@/modules/users';

import { ErrorResponse } from '@/utils/base';
import { CurrentUser } from '@/utils/decorators';
import { AuthorizedOnly } from '@/utils/guards';

import { GameDeliveryType, GameFilter, GameGenre, GameRegion, GameView } from './constants';
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

@ApiTags('🎮 games')
@Controller('/games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Некорректные параметры запроса'
  })
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
  async getGames(@Query() getGamesSearchDto: GetGamesSearchDto): Promise<GamesPaginatedResponse> {
    return this.gamesService.getGames(getGamesSearchDto);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Некорректные параметры поиска'
  })
  @ApiOperation({ summary: 'Поиск по играм' })
  @ApiQuery({ type: String, description: 'Строка поиска', required: true, name: 'search' })
  @ApiQuery({ type: Number, description: 'Лимит', required: false, name: 'limit' })
  @ApiResponse({ type: GameSearchResponse, status: 200 })
  @Get('/search')
  async searchGames(@Query() searchGamesDto: SearchGamesDto): Promise<GameSearchResponse> {
    return this.gamesService.searchGames(searchGamesDto);
  }

  @ApiNotFoundResponse({
    type: ErrorResponse,
    description: 'Игра не найдена'
  })
  @ApiOperation({ summary: 'Получить игру' })
  @ApiResponse({ type: GameResponse, status: 200 })
  @Get('/info/:slug')
  async getGame(@Param() getGameDto: GetGameDto): Promise<GameResponse> {
    return this.gamesService.getGame(getGameDto);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Некорректные параметры запроса'
  })
  @ApiNotFoundResponse({
    type: ErrorResponse,
    description: 'Регионы не найдены'
  })
  @ApiOperation({ summary: 'Получить регионы' })
  @ApiQuery({ type: String, description: 'Slug игры', required: true, name: 'slug' })
  @ApiQuery({
    description: 'Тип доставки',
    example: GameDeliveryType.STEAM_GIFT,
    enum: GameDeliveryType,
    required: true,
    enumName: 'GameDeliveryType',
    name: 'deliveryType'
  })
  @ApiResponse({ type: GameRegionsResponse, status: 200 })
  @Get('/regions')
  async getGameRegions(
    @Query() getGameRegionsDto: GetGameRegionsDto
  ): Promise<GameRegionsResponse> {
    return this.gamesService.getGameRegions(getGameRegionsDto);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Некорректные параметры запроса'
  })
  @ApiNotFoundResponse({
    type: ErrorResponse,
    description: 'Варианты не найдены'
  })
  @ApiOperation({ summary: 'Получить варианты цен' })
  @ApiQuery({ type: String, description: 'Slug игры', required: true, name: 'slug' })
  @ApiQuery({
    description: 'Тип доставки',
    example: GameDeliveryType.STEAM_GIFT,
    enum: GameDeliveryType,
    required: true,
    enumName: 'GameDeliveryType',
    name: 'deliveryType'
  })
  @ApiQuery({
    description: 'Регион',
    example: GameRegion.RU,
    enum: GameRegion,
    required: true,
    enumName: 'GameRegion',
    name: 'region'
  })
  @ApiResponse({ type: GamePriceVariantsResponse, status: 200 })
  @Get('/price-variants')
  async getPriceVariants(
    @Query() getGamePriceVariantsDto: GetGamePriceVariantsDto
  ): Promise<GamePriceVariantsResponse> {
    return this.gamesService.getGamePriceVariants(getGamePriceVariantsDto);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Некорректные данные заказа или не указана ссылка приглашения'
  })
  @ApiNotFoundResponse({
    type: ErrorResponse,
    description: 'Игра или вариант цены не найдены'
  })
  @ApiOperation({ summary: 'Создать заказ игры и транзакцию для оплаты' })
  @ApiResponse({ type: CreateGameOrderResponse, status: 200 })
  @Post('/order')
  async createGameOrder(
    @Body() createGameOrderDto: CreateGameOrderDto
  ): Promise<CreateGameOrderResponse> {
    return this.gamesService.createGameOrder(createGameOrderDto);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Пользователь не найден'
  })
  @ApiOperation({ summary: 'Получить все заказы игр' })
  @ApiResponse({ type: GameOrdersResponse, status: 200 })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: 'Не авторизован'
  })
  @Get('/orders')
  @AuthorizedOnly()
  async getGameOrders(@CurrentUser() user: User): Promise<GameOrdersResponse> {
    return this.gamesService.getGameOrders(user.phone);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Не указан или недействителен одноразовый токен доступа'
  })
  @ApiNotFoundResponse({
    type: ErrorResponse,
    description: 'Заказ не найден'
  })
  @ApiOperation({ summary: 'Получить оплаченный заказ игры по одноразовому токену' })
  @ApiQuery({
    type: String,
    description: 'Одноразовый токен доступа',
    example: '1f2e3d4c5b6a7980abcdef1234567890abcdef1234567890abcdef1234567890',
    required: true,
    name: 'token'
  })
  @ApiResponse({ type: GameOrderResponse, status: 200 })
  @Get('/orders/paid')
  async getGamePaidOrder(
    @Query() getGamePaidOrderDto: GetGamePaidOrderDto
  ): Promise<GameOrderResponse> {
    return this.gamesService.getGamePaidOrder(getGamePaidOrderDto);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Пользователь не найден'
  })
  @ApiNotFoundResponse({
    type: ErrorResponse,
    description: 'Заказ не найден'
  })
  @ApiOperation({ summary: 'Получить заказ игры' })
  @ApiResponse({ type: GameOrderResponse, status: 200 })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: 'Не авторизован'
  })
  @Get('/orders/:orderId')
  @AuthorizedOnly()
  async getGameOrder(
    @Param() getGameOrderDto: GetGameOrderDto,
    @CurrentUser() user: User
  ): Promise<GameOrderResponse> {
    return this.gamesService.getGameOrder(getGameOrderDto.orderId, user.phone);
  }
}
