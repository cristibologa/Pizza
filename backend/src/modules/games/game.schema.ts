import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { GameGenre, GameType } from './constants';
import { GamePriceVariant, GameSystemRequirements } from './game.entity';

@ObjectType({ description: 'Игра каталога' })
@Schema({
  collection: 'games',
  minimize: false,
  versionKey: false
})
export class GameEntitySchema {
  @Prop({ required: true })
  screenshots: string[];

  @Prop({
    enum: Object.values(GameType),
    required: true,
    default: GameType.GAME,
    index: true
  })
  type: GameType;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: true, unique: true })
  slug: string;

  @Prop({ required: true })
  externalId: string;

  @Prop({ required: true, index: true })
  releaseDate: number;

  @Prop({
    type: [String],
    enum: Object.values(GameGenre),
    required: true
  })
  genres: GameGenre[];

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, default: false, index: true })
  isPopular: boolean;

  @Prop({ required: true })
  developer: string;

  @Prop({ required: true })
  publisher: string;

  @Prop({ type: Object, required: true })
  minimumSystemRequirements: GameSystemRequirements;

  @Prop({ type: Object, required: true })
  recommendedSystemRequirements: GameSystemRequirements;

  @Prop({ type: Array, required: true })
  priceVariants: GamePriceVariant[];
}

export type GameDocument = HydratedDocument<GameEntitySchema>;
export const GameSchema = SchemaFactory.createForClass(GameEntitySchema);
