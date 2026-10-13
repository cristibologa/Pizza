import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { FilmHall } from './film-hall.entity';

@InputType('FilmScheduleSeanceInput')
@ObjectType()
export class FilmScheduleSeance {
  @ApiProperty({ description: 'Время сеанса', example: '12:00' })
  @Field(() => String)
  time: string;

  @ApiProperty({ type: FilmHall, description: 'Зал' })
  @Field(() => FilmHall)
  hall: FilmHall;
}

@InputType('FilmScheduleInput')
@ObjectType()
export class FilmSchedule {
  @ApiProperty({ description: 'Дата', example: '01.01.2024' })
  @Field(() => String)
  date: string;

  @ApiProperty({ type: [FilmScheduleSeance], description: 'Сеансы' })
  @Field(() => [FilmScheduleSeance])
  seances: FilmScheduleSeance[];
}
