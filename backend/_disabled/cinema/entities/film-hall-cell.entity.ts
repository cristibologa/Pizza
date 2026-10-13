import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

export enum FilmHallCellStatus {
  DEFAULT = 'default',
  PAID = 'paid'
}

registerEnumType(FilmHallCellStatus, {
  name: 'FilmHallCellStatus'
});

export enum FilmHallCellType {
  ECONOM = 'econom',
  COMFORT = 'comfort',
  BLOCKED = 'blocked',
  PAID = 'paid'
}

registerEnumType(FilmHallCellType, {
  name: 'FilmHallCellType'
});

@InputType('FilmHallCellInput')
@ObjectType()
export class FilmHallCell {
  @ApiProperty({
    description: 'Тип места в зале',
    example: FilmHallCellType.ECONOM,
    enum: FilmHallCellType,
    enumName: 'FilmHallCellType'
  })
  @Field(() => FilmHallCellType)
  type: FilmHallCellType;

  @ApiProperty()
  @ApiProperty({ description: 'Цена места в зале', example: 100 })
  @Field(() => Number)
  price: number;
}
