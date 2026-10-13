import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '@/utils/services';

import { Film, FilmSchedule } from './entities';
import { CinemaOrder } from './modules/cinema-order/cinema-order.entity';

@ObjectType()
export class FilmResponse extends BaseResponse {
  @ApiProperty({ type: Film, description: 'Фильм' })
  @Field(() => Film)
  film: Film;
}

@ObjectType()
export class FilmsResponse extends BaseResponse {
  @ApiProperty({ type: [Film], description: 'Фильмы' })
  @Field(() => [Film])
  films: Film[];
}

@ObjectType()
export class ScheduleResponse extends BaseResponse {
  @ApiProperty({
    type: FilmSchedule,
    description: 'Расписание'
  })
  @Field(() => FilmSchedule)
  schedules: FilmSchedule[];
}

@ObjectType()
export class PaymentResponse extends BaseResponse {
  @ApiProperty({ type: CinemaOrder, description: 'Заказ' })
  @Field(() => CinemaOrder)
  order: CinemaOrder;
}

@ObjectType()
export class CinemaOrdersResponse extends BaseResponse {
  @ApiProperty({ type: [CinemaOrder], description: 'Заказы' })
  @Field(() => [CinemaOrder])
  orders: CinemaOrder[];
}
