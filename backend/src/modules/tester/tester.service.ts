import type { FastifyReply } from 'fastify';

import { Injectable } from '@nestjs/common';

import type { Session } from '@/modules/sessions';
import type { User } from '@/modules/users';

import { AuthService } from '@/modules/auth';
import { SignInDto } from '@/modules/auth/dto';
import { SignInResponse } from '@/modules/auth/responses';
import { CardsService } from '@/modules/cards';
import { DeleteCardResponse, GetCardsResponse } from '@/modules/cards/responses';
import {
  CreateGameOrderDto,
  GetGameDto,
  GetGameOrderDto,
  GetGamePaidOrderDto,
  GetGamePriceVariantsDto,
  GetGameRegionsDto,
  GetGamesSearchDto,
  SearchGamesDto
} from '@/modules/games/dto';
import {
  CreateGameOrderResponse,
  GameOrderResponse,
  GameOrdersResponse,
  GamePriceVariantsResponse,
  GameRegionsResponse,
  GameResponse,
  GameSearchResponse,
  GamesPaginatedResponse
} from '@/modules/games/games.model';
import { GamesService } from '@/modules/games/games.service';
import { OtpsService } from '@/modules/otps';
import { CreateOtpDto } from '@/modules/otps/dto';
import { CreateOtpResponse } from '@/modules/otps/responses';
import { ClientType } from '@/modules/sessions';
import { UpdateProfileDto } from '@/modules/users/dto';
import { GetProfileResponse, UpdateProfileResponse } from '@/modules/users/responses';
import { UsersService } from '@/modules/users/users.service';
import { BaseResponse } from '@/utils/base';
import { Result } from '@/utils/helpers';

@Injectable()
export class TesterService {
  constructor(
    private readonly authService: AuthService,
    private readonly cardsService: CardsService,
    private readonly gamesService: GamesService,
    private readonly otpsService: OtpsService,
    private readonly usersService: UsersService
  ) {}

  createOtp(createOtpDto: CreateOtpDto): Promise<CreateOtpResponse> {
    return this.otpsService.createOtp(createOtpDto);
  }

  async signIn(
    signInDto: SignInDto,
    reply: FastifyReply,
    clientType: ClientType
  ): Promise<SignInResponse> {
    return this.authService.signIn(signInDto, reply, clientType);
  }

  async signOut(
    session: Session,
    reply: FastifyReply,
    clientType: ClientType
  ): Promise<BaseResponse> {
    return this.authService.signOut(session._id, reply, clientType);
  }

  updateProfile(user: User, updateProfileDto: UpdateProfileDto): Promise<UpdateProfileResponse> {
    return this.usersService.updateProfile(user._id, updateProfileDto);
  }

  getProfile(user: User): GetProfileResponse {
    return Result.success({ user });
  }

  getCards(user: User): Promise<GetCardsResponse> {
    return this.cardsService.getCards(user.phone);
  }

  deleteCard(user: User, cardId: string): Promise<DeleteCardResponse> {
    return this.cardsService.deleteCard(user.phone, cardId);
  }

  getGames(getGamesSearchDto: GetGamesSearchDto): Promise<GamesPaginatedResponse> {
    return this.gamesService.getGames(getGamesSearchDto);
  }

  searchGames(searchGamesDto: SearchGamesDto): Promise<GameSearchResponse> {
    return this.gamesService.searchGames(searchGamesDto);
  }

  getGame(getGameDto: GetGameDto): Promise<GameResponse> {
    return this.gamesService.getGame(getGameDto);
  }

  getGameRegions(getGameRegionsDto: GetGameRegionsDto): Promise<GameRegionsResponse> {
    return this.gamesService.getGameRegions(getGameRegionsDto);
  }

  getGamePriceVariants(
    getGamePriceVariantsDto: GetGamePriceVariantsDto
  ): Promise<GamePriceVariantsResponse> {
    return this.gamesService.getGamePriceVariants(getGamePriceVariantsDto);
  }

  createGameOrder(createGameOrderDto: CreateGameOrderDto): Promise<CreateGameOrderResponse> {
    return this.gamesService.createGameOrder(createGameOrderDto);
  }

  getGameOrders(user: User): Promise<GameOrdersResponse> {
    return this.gamesService.getGameOrders(user.phone);
  }

  getGameOrder(getGameOrderDto: GetGameOrderDto, user: User): Promise<GameOrderResponse> {
    return this.gamesService.getGameOrder(getGameOrderDto.orderId, user.phone);
  }

  getGamePaidOrder(getGamePaidOrderDto: GetGamePaidOrderDto): Promise<GameOrderResponse> {
    return this.gamesService.getGamePaidOrder(getGamePaidOrderDto);
  }
}
