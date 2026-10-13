import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { FilmHallCell, FilmHallCellType } from './film-hall-cell.entity';

@InputType('FilmHallInput')
@ObjectType()
export class FilmHall {
  @ApiProperty({ description: 'Название зала', example: 'red' })
  @Field(() => String)
  name: string;

  @ApiProperty({
    type: [[FilmHallCell]],
    description: 'Места в зале',
    example: [[{ type: FilmHallCellType.ECONOM, price: 100 }]],
    enumName: 'FilmHallCell'
  })
  @Field(() => [[FilmHallCell]])
  places: FilmHallCell[][];
}
