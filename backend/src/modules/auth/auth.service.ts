import { BadRequestException, Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Types } from 'mongoose';

import { Result } from '@/utils/helpers';

import { OtpsService } from '../otps';
import { ClientType, SessionsService } from '../sessions';
import { UsersService } from '../users';
import { SignInDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly otpsService: OtpsService,
    private readonly usersService: UsersService
  ) {}

  async signIn(signInDto: SignInDto, reply: FastifyReply, clientType: ClientType) {
    const user = await this.usersService.findOrCreateUser(signInDto.phone);

    const otp = await this.otpsService.findOne({ phone: signInDto.phone, code: signInDto.code });

    if (!otp) {
      throw new BadRequestException(Result.fail('Неправильный отп код'));
    }

    await this.otpsService.deleteOne({ _id: otp._id });

    const session = await this.sessionsService.create({
      userId: user._id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    });

    const token = session._id.toString();

    if (clientType === ClientType.WEB) {
      reply.setCookie('session_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
    }

    return Result.success({
      user,
      ...(clientType === ClientType.MOBILE && { token })
    });
  }

  async signOut(sessionId: Types.ObjectId, reply: FastifyReply, clientType: ClientType) {
    await this.sessionsService.deleteById(sessionId);

    if (clientType === ClientType.WEB) {
      reply.clearCookie('session_token', {
        path: '/'
      });
    }

    return Result.success();
  }
}
