import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '@/utils/services';

import { Car, CarsPaginationMeta } from './entities';
import { CarRent } from './modules';

@ObjectType()
export class CarsPaginatedResponse extends BaseResponse {
  @ApiProperty({ type: [Car], description: 'Массив автомобилей с информацией' })
  @Field(() => [Car])
  data: Car[];

  @ApiProperty({
    type: CarsPaginationMeta,
    description: 'Метаданные пагинации (общее количество, текущая страница и т.д.)'
  })
  @Field(() => CarsPaginationMeta)
  meta: CarsPaginationMeta;
}

@ObjectType()
export class BookedDateRange {
  @ApiProperty({ description: 'Дата начала аренды (timestamp)', example: 1717236000000 })
  @Field(() => Number)
  startDate: number;

  @ApiProperty({ description: 'Дата окончания аренды (timestamp)', example: 1717610400000 })
  @Field(() => Number)
  endDate: number;
}

@ObjectType()
export class CarWithRents extends Car {
  @ApiProperty({
    type: [BookedDateRange],
    description: 'Занятые промежутки дат (timestamp)'
  })
  @Field(() => [BookedDateRange])
  rents: BookedDateRange[];
}

@ObjectType()
export class CarResponse extends BaseResponse {
  @ApiProperty({
    type: CarWithRents,
    description: 'Данные автомобиля с арендованными датами'
  })
  @Field(() => CarWithRents)
  data: CarWithRents;
}

@ObjectType()
export class CarRentResponse extends BaseResponse {
  @ApiProperty({ type: CarRent, description: 'Аренда' })
  @Field(() => CarRent)
  rent: CarRent;
}

@ObjectType()
export class CarRentsResponse extends BaseResponse {
  @ApiProperty({ type: [CarRent], description: 'Аренды' })
  @Field(() => [CarRent])
  rents: CarRent[];
}
