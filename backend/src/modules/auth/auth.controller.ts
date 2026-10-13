import type { FastifyReply } from 'fastify';

import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { Session } from '@/modules/sessions';
import { BaseResponse, ErrorResponse } from '@/utils/base';
import { Client, CurrentSession } from '@/utils/decorators';
import { AuthorizedOnly } from '@/utils/guards';

import { ClientType } from '../sessions';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { SignInResponse } from './responses';

@ApiTags('🔒 auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Неправильный отп код или некорректные данные запроса'
  })
  @ApiHeader({
    example: ClientType.WEB,
    enum: ClientType,
    required: false,
    name: 'x-application'
  })
  @ApiOperation({ summary: 'Войти' })
  @ApiResponse({
    type: SignInResponse,
    description: 'sign-in',
    status: 200
  })
  @Post('/sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Client() clientType: ClientType,
    @Res({
      passthrough: true
    })
    reply: FastifyReply
  ): Promise<SignInResponse> {
    return this.authService.signIn(signInDto, reply, clientType);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Пользователь не найден'
  })
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
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: 'Не авторизован'
  })
  @Post('/sign-out')
  @AuthorizedOnly()
  async signOut(
    @CurrentSession() session: Session,
    @Res({ passthrough: true }) reply: FastifyReply,
    @Client() clientType: ClientType
  ): Promise<BaseResponse> {
    return this.authService.signOut(session._id, reply, clientType);
  }
}
