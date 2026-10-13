import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

export enum Profession {
  ACTOR = 'actor',
  DIRECTOR = 'director'
}

registerEnumType(Profession, {
  name: 'Profession'
});

@InputType('FilmStaffInput')
@ObjectType()
export class FilmStaff {
  @ApiProperty({ description: 'Идентификатор персоны', example: '1' })
  @Field(() => String)
  id: string;

  @ApiProperty({
    description: 'Список профессий',
    example: [Profession.ACTOR, Profession.DIRECTOR],
    enum: Profession,
    isArray: true,
    enumName: 'Profession'
  })
  @Field(() => [Profession])
  professions: Profession[];

  @ApiProperty({ description: 'Полное имя персоны' })
  @Field(() => String)
  fullName: string;

  @ApiProperty({ description: 'Фото персоны' })
  @Field(() => String)
  photo: string;
}
