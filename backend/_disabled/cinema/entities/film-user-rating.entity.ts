import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType('FilmUserRatingInput')
@ObjectType()
export class FilmUserRating {
  @ApiProperty()
  @ApiProperty({ description: 'Рейтинг кинопоиск', example: '10' })
  @Field(() => String)
  kinopoisk: string;

  @ApiProperty()
  @ApiProperty({ description: 'Рейтинг imdb', example: '10' })
  @Field(() => String)
  imdb: string;
}
