import type { FastifyReply } from 'fastify';

import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { ClientType, Session } from '@/modules/sessions';
import { BaseResponse } from '@/utils/base';
import { Client, CurrentSession } from '@/utils/decorators';
import { AuthorizedOnly } from '@/utils/guards';

import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { SignInResponse } from './responses';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInResponse)
  async signIn(
    @Args() signInDto: SignInDto,
    @Client() clientType: ClientType,
    @Context() ctx: { reply: FastifyReply }
  ): Promise<SignInResponse> {
    return this.authService.signIn(signInDto, ctx.reply, clientType);
  }

  @Mutation(() => BaseResponse)
  @AuthorizedOnly()
  async signOut(
    @CurrentSession() session: Session,
    @Client() clientType: ClientType,
    @Context() ctx: { reply: FastifyReply }
  ): Promise<BaseResponse> {
    return this.authService.signOut(session._id, ctx.reply, clientType);
  }
}
