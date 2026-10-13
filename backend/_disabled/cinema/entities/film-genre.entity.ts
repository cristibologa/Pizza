import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType('FilmGenreInput')
@ObjectType()
export class FilmGenre {
  @ApiProperty({ description: 'Идентификатор жанра', example: '1' })
  @Field(() => String)
  id: string;

  @ApiProperty()
  @ApiProperty({ description: 'Название жанра', example: 'genre' })
  @Field(() => String)
  name: string;
}
