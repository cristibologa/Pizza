import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GameOrderListener } from './game-order.listener';
import { GameOrderEntitySchema, GameOrderSchema } from './game-order.schema';
import { GameOrderService } from './game-order.service';

@Module({
  exports: [GameOrderService],
  imports: [
    MongooseModule.forFeature([{ name: GameOrderEntitySchema.name, schema: GameOrderSchema }])
  ],
  providers: [GameOrderListener, GameOrderService]
})
export class GameOrderModule {}
