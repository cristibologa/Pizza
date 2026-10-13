import { Module } from '@nestjs/common';

import { OtpsModule } from '../otps';
import { SessionsModule } from '../sessions';
import { UsersModule } from '../users';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [UsersModule, SessionsModule, OtpsModule],
  providers: [AuthService, AuthResolver]
})
export class AuthModule {}
