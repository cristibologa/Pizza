import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GameEntitySchema } from '@/modules/games/game.schema';
import { Seeder } from '@/utils/interfaces';

import { GAMES } from './games.seed';

@Injectable()
export class GamesSeeder implements Seeder {
  private readonly logger = new Logger(GamesSeeder.name);

  constructor(
    @InjectModel(GameEntitySchema.name) private readonly gameModel: Model<GameEntitySchema>
  ) {}

  async seed() {
    await this.gameModel.deleteMany();
    await this.gameModel.insertMany(GAMES);

    this.logger.log(`🎮 Games seeded: ${GAMES.length}`);
  }
}
