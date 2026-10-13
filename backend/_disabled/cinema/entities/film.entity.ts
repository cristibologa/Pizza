import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { Country } from '@/utils/common';

import { FilmStaff } from './film-staff.entity';
import { FilmUserRating } from './film-user-rating.entity';

export enum Rating {
  G = 'g',
  PG = 'pg',
  PG13 = 'pg13',
  R = 'r',
  NC17 = 'nc17'
}

registerEnumType(Rating, {
  name: 'Rating'
});

@InputType('FilmInput')
@ObjectType()
export class Film {
  @ApiProperty({ description: 'Идентификатор фильма', example: '1' })
  @Field(() => String)
  id: string;

  @ApiProperty()
  @ApiProperty({ description: 'Название фильма' })
  @Field(() => String)
  name: string;

  @ApiProperty()
  @ApiProperty({ description: 'Оригинальное название' })
  @Field(() => String)
  originalName: string;

  @ApiProperty()
  @ApiProperty({ description: 'Описание фильма' })
  @Field(() => String)
  description: string;

  @ApiProperty()
  @ApiProperty({ description: 'Дата выхода' })
  @Field(() => String)
  releaseDate: string;

  @ApiProperty()
  @ApiProperty({ type: [FilmStaff], description: 'Актеры' })
  @Field(() => [FilmStaff], { defaultValue: [] })
  actors: FilmStaff[];

  @ApiProperty()
  @ApiProperty({ type: [FilmStaff], description: 'Режиссер' })
  @Field(() => [FilmStaff], { defaultValue: [] })
  directors: FilmStaff[];

  @ApiProperty()
  @ApiProperty({ type: Number, description: 'Продолжительность' })
  @Field(() => Number)
  runtime: number;

  @ApiProperty()
  @ApiProperty({
    description: 'Возрастное ограничение',
    example: Rating.G,
    enum: Rating,
    enumName: 'Rating'
  })
  @Field(() => Rating)
  ageRating: Rating;

  @ApiProperty()
  @Field(() => [String], { defaultValue: [] })
  genres: string[];

  @ApiProperty()
  @ApiProperty({ type: FilmUserRating, description: 'Рейтинг пользователей' })
  @Field(() => FilmUserRating)
  userRatings: FilmUserRating;

  @ApiProperty()
  @ApiProperty({ description: 'Изображение фильма' })
  @Field(() => String)
  img: string;

  @ApiProperty()
  @ApiProperty({ description: 'Страна', nullable: true, required: false })
  @Field(() => Country, { nullable: true })
  country?: Country;
}
