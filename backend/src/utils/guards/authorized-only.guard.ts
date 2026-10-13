import {
  applyDecorators,
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { Types } from 'mongoose';

import { SessionsService } from '@/modules/sessions/sessions.service';
import { UsersService } from '@/modules/users/users.service';
import { getRequest, Result } from '@/utils/helpers';

const AUTHORIZED_ONLY_KEY = 'authorized-only';

@Injectable()
export class AuthorizedOnlyGuard implements CanActivate {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext) {
    const isAuthorizedOnly = this.reflector.getAllAndOverride<boolean>(AUTHORIZED_ONLY_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!isAuthorizedOnly) return true;

    const request = getRequest(context);

    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException(Result.fail('Не авторизован'));
    }

    if (!Types.ObjectId.isValid(token)) {
      throw new UnauthorizedException(Result.fail('Не авторизован'));
    }

    const session = await this.sessionsService.findById(token);

    if (!session) {
      throw new UnauthorizedException(Result.fail('Не авторизован'));
    }

    const user = await this.usersService.findOne({ _id: session.userId });

    if (!user) {
      throw new BadRequestException(Result.fail('Пользователь не найден'));
    }

    request.user = user;
    request.session = session;

    return true;
  }

  private extractToken(request: FastifyRequest) {
    const cookieToken = request.cookies?.session_token;
    if (cookieToken) return cookieToken;

    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) return null;

    return token;
  }
}

export const AuthorizedOnly = () =>
  applyDecorators(
    SetMetadata(AUTHORIZED_ONLY_KEY, true),
    ApiBearerAuth('mobile-auth'),
    ApiCookieAuth('web-auth')
  );
