import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GameOrder, GameOrderSchema } from './game-order.entity';
import { GameOrderService } from './game-order.service';

@Module({
  exports: [GameOrderService],
  imports: [MongooseModule.forFeature([{ name: GameOrder.name, schema: GameOrderSchema }])],
  providers: [GameOrderService]
})
export class GameOrderModule {}
