import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

import { transformSearchParam } from '@/utils/helpers';

import { GameFilter, GameGenre, GameView } from '../constants';

@ArgsType()
export class GetGamesDto {
  @ApiProperty({
    description: 'Дополнительные фильтры',
    example: [GameFilter.DISCOUNT, GameFilter.DLC],
    enum: GameFilter,
    isArray: true,
    required: false,
    enumName: 'GameFilter'
  })
  @Field(() => [GameFilter], { nullable: true })
  @Transform(transformSearchParam)
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  filter?: GameFilter[];

  @ApiProperty({
    description: 'Предустановленный вид выборки',
    example: GameView.POPULAR,
    enum: GameView,
    required: false,
    enumName: 'GameView'
  })
  @Field(() => GameView, { nullable: true })
  @IsOptional()
  @IsString()
  view?: GameView;

  @ApiProperty({
    description: 'Фильтр по жанрам',
    example: [GameGenre.ACTION, GameGenre.RPG],
    enum: GameGenre,
    isArray: true,
    required: false,
    enumName: 'GameGenre'
  })
  @Field(() => [GameGenre], { nullable: true })
  @Transform(transformSearchParam)
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  genre?: GameGenre[];

  @ApiProperty({ description: 'Страница', example: 1, required: false })
  @Field(() => Number, { nullable: true })
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Лимит', example: 10, required: false })
  @Field(() => Number, { nullable: true })
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  limit?: number;
}
