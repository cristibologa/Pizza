import type { FastifyReply } from 'fastify';

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { Session } from '@/modules/sessions';
import type { User } from '@/modules/users';

import { SignInDto } from '@/modules/auth/dto';
import { SignInResponse } from '@/modules/auth/responses';
import { DeleteCardResponse, GetCardsResponse } from '@/modules/cards/responses';
import { CreateOtpDto } from '@/modules/otps/dto';
import { CreateOtpResponse } from '@/modules/otps/responses';
import { ClientType } from '@/modules/sessions';
import { UpdateProfileDto } from '@/modules/users/dto';
import { GetProfileResponse, UpdateProfileResponse } from '@/modules/users/responses';
import { BaseResponse } from '@/utils/base';
import { Client, CurrentSession, CurrentUser } from '@/utils/decorators';
import { AuthorizedOnly } from '@/utils/guards';
import { Result } from '@/utils/helpers';

import { GameDeliveryType, GameFilter, GameGenre, GameRegion, GameView } from '../games/constants';
import {
  CreateGameOrderDto,
  GetGameDto,
  GetGameOrderDto,
  GetGamePaidOrderDto,
  GetGamePriceVariantsDto,
  GetGameRegionsDto,
  GetGamesSearchDto,
  SearchGamesDto
} from '../games/dto';
import {
  CreateGameOrderResponse,
  GameOrderResponse,
  GameOrdersResponse,
  GamePriceVariantsResponse,
  GameRegionsResponse,
  GameResponse,
  GameSearchResponse,
  GamesPaginatedResponse
} from '../games/games.model';
import { TesterService } from './tester.service';

@ApiTags('🧪 tester')
@Controller('tester')
export class TesterController {
  constructor(private readonly testerService: TesterService) {}

  @ApiOperation({ summary: 'Создание отп кода' })
  @ApiResponse({
    type: CreateOtpResponse,
    description: 'create otp',
    status: 200
  })
  @Post('/otps/otp')
  async createOtp(@Body() createOtpDto: CreateOtpDto): Promise<CreateOtpResponse> {
    return this.testerService.createOtp(createOtpDto);
  }

  @ApiHeader({
    example: ClientType.WEB,
    enum: ClientType,
    required: false,
    name: 'x-application'
  })
  @ApiOperation({ summary: 'Авторизация' })
  @ApiResponse({
    type: SignInResponse,
    description: 'sign-in',
    status: 200
  })
  @Post('/auth/sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Client() clientType: ClientType,
    @Res({ passthrough: true }) reply: FastifyReply
  ): Promise<SignInResponse> {
    const digits = signInDto.phone.replace(/\D/g, '');

    if (/^7+$/.test(digits)) {
      throw new BadRequestException(
        Result.fail('Номер телефона не может состоять только из семерок')
      );
    }

    return this.testerService.signIn(signInDto, reply, clientType);
  }

  @ApiHeader({
    example: ClientType.WEB,
    enum: ClientType,
    required: false,
    name: 'x-application'
  })
  @ApiOperation({ summary: 'Выйти' })
  @ApiResponse({
    type: BaseResponse,
    description: 'sign-out',
    status: 200
  })
  @Post('/auth/sign-out')
  @AuthorizedOnly()
  async signOut(
    @CurrentSession() session: Session,
    @Res({ passthrough: true }) reply: FastifyReply,
    @Client() clientType: ClientType
  ): Promise<BaseResponse> {
    return this.testerService.signOut(session, reply, clientType);
  }

  @ApiOperation({ summary: 'Обновить профиль пользователя' })
  @ApiResponse({
    type: UpdateProfileResponse,
    description: 'update profile',
    status: 200
  })
  @Patch('/users/profile')
  @AuthorizedOnly()
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: User
  ): Promise<UpdateProfileResponse> {
    return this.testerService.updateProfile(user, updateProfileDto);
  }

  @ApiOperation({ summary: 'Получить профиль пользователя' })
  @ApiResponse({
    type: GetProfileResponse,
    description: 'get profile',
    status: 200
  })
  @Get('/users/profile')
  @AuthorizedOnly()
  getProfile(@CurrentUser() user: User): GetProfileResponse {
    return this.testerService.getProfile(user);
  }

  @ApiOperation({ summary: 'Получить список сохраненных карт пользователя' })
  @ApiResponse({
    type: GetCardsResponse,
    description: 'get user cards',
    status: 200
  })
  @Get('/cards/cards')
  @AuthorizedOnly()
  async getCards(@CurrentUser() user: User): Promise<GetCardsResponse> {
    return this.testerService.getCards(user);
  }

  @ApiOperation({ summary: 'Удалить сохраненную карту пользователя' })
  @ApiResponse({
    type: DeleteCardResponse,
    description: 'delete user card',
    status: 200
  })
  @Delete('/cards/cards/:id')
  @AuthorizedOnly()
  async deleteCard(
    @CurrentUser() user: User,
    @Param('id') cardId: string
  ): Promise<DeleteCardResponse> {
    return this.testerService.deleteCard(user, cardId);
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
  @Get('/games/info')
  async getGames(@Query() getGamesSearchDto: GetGamesSearchDto): Promise<GamesPaginatedResponse> {
    return this.testerService.getGames(getGamesSearchDto);
  }

  @ApiOperation({ summary: 'Поиск по играм' })
  @ApiQuery({ type: String, description: 'Строка поиска', required: true, name: 'search' })
  @ApiQuery({ type: Number, description: 'Лимит', required: false, name: 'limit' })
  @ApiResponse({ type: GameSearchResponse, status: 200 })
  @Get('/games/search')
  async searchGames(@Query() searchGamesDto: SearchGamesDto): Promise<GameSearchResponse> {
    return this.testerService.searchGames(searchGamesDto);
  }

  @ApiOperation({ summary: 'Получить игру' })
  @ApiResponse({ type: GameResponse, status: 200 })
  @Get('/games/info/:slug')
  async getGame(@Param() getGameDto: GetGameDto): Promise<GameResponse> {
    return this.testerService.getGame(getGameDto);
  }

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
  @Get('/games/regions')
  async getGameRegions(
    @Query() getGameRegionsDto: GetGameRegionsDto
  ): Promise<GameRegionsResponse> {
    return this.testerService.getGameRegions(getGameRegionsDto);
  }

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
  @Get('/games/price-variants')
  async getGamePriceVariants(
    @Query() getGamePriceVariantsDto: GetGamePriceVariantsDto
  ): Promise<GamePriceVariantsResponse> {
    return this.testerService.getGamePriceVariants(getGamePriceVariantsDto);
  }

  @ApiOperation({ summary: 'Создать заказ игры и транзакцию для оплаты' })
  @ApiResponse({ type: CreateGameOrderResponse, status: 200 })
  @Post('/games/order')
  async createGameOrder(
    @Body() createGameOrderDto: CreateGameOrderDto
  ): Promise<CreateGameOrderResponse> {
    return this.testerService.createGameOrder(createGameOrderDto);
  }

  @ApiOperation({ summary: 'Получить все заказы игр' })
  @ApiResponse({ type: GameOrdersResponse, status: 200 })
  @Get('/games/orders')
  @AuthorizedOnly()
  async getGameOrders(@CurrentUser() user: User): Promise<GameOrdersResponse> {
    return this.testerService.getGameOrders(user);
  }

  @ApiOperation({ summary: 'Получить оплаченный заказ игры' })
  @ApiQuery({
    type: String,
    description: 'Одноразовый токен доступа',
    example: '1f2e3d4c5b6a7980abcdef1234567890abcdef1234567890abcdef1234567890',
    required: true,
    name: 'token'
  })
  @ApiResponse({ type: GameOrderResponse, status: 200 })
  @Get('/games/orders/paid')
  async getGamePaidOrder(
    @Query() getGamePaidOrderDto: GetGamePaidOrderDto
  ): Promise<GameOrderResponse> {
    return this.testerService.getGamePaidOrder(getGamePaidOrderDto);
  }

  @ApiOperation({ summary: 'Получить заказ игры' })
  @ApiResponse({ type: GameOrderResponse, status: 200 })
  @Get('/games/orders/:orderId')
  @AuthorizedOnly()
  async getGameOrder(
    @Param() getGameOrderDto: GetGameOrderDto,
    @CurrentUser() user: User
  ): Promise<GameOrderResponse> {
    return this.testerService.getGameOrder(getGameOrderDto, user);
  }
}
