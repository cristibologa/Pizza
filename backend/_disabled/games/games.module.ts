import { Module } from '@nestjs/common';

import { UsersModule } from '@/modules/users';
import { AuthModule } from '@/utils/services';

import { GamesController } from './games.controller';
import { GamesMutation } from './games.mutation';
import { GamesQuery } from './games.query';
import { GamesService } from './games.service';
import { GameOrderModule } from './modules';

@Module({
  controllers: [GamesController],
  exports: [],
  imports: [AuthModule, UsersModule, GameOrderModule],
  providers: [GamesService, GamesQuery, GamesMutation]
})
export class GamesModule {}
