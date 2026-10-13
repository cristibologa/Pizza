import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { FilmHall } from './film-hall.entity';

@InputType('FilmSeanceInput')
@ObjectType()
export class FilmSeance {
  @ApiProperty({ description: 'Время сеанса' })
  @Field(() => String)
  time: string;

  @ApiProperty({ type: FilmHall, description: 'Зал сеанса' })
  @Field(() => FilmHall)
  hall: FilmHall;
}
