import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CardEntitySchema, CardSchema } from './card.schema';
import { CardsController } from './cards.controller';
import { CardsResolver } from './cards.resolver';
import { CardsService } from './cards.service';

@Module({
  controllers: [CardsController],
  exports: [CardsService],
  imports: [MongooseModule.forFeature([{ name: CardEntitySchema.name, schema: CardSchema }])],
  providers: [CardsService, CardsResolver]
})
export class CardsModule {}
