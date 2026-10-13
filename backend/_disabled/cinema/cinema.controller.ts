import type { FastifyRequest } from 'fastify';

import { BadRequestException, Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthorizedOnlyGuard } from '@/modules/auth';
import { getDDMMYYFormatDate } from '@/utils/helpers';
import { AuthService, BaseResolver, BaseResponse } from '@/utils/services';

import type { User } from '../users';

import { UsersService } from '../users';
import {
  CinemaOrdersResponse,
  FilmResponse,
  FilmsResponse,
  PaymentResponse,
  ScheduleResponse
} from './cinema.model';
import { CinemaService } from './cinema.service';
import { CancelCinemaOrderDto, CreateCinemaPaymentDto, GetFilmDto, GetScheduleDto } from './dto';
import { FilmHallCellType } from './entities';
import {
  CinemaOrderService,
  CinemaOrderStatus,
  CinemaTicketService,
  CinemaTicketStatus
} from './modules';

@ApiTags('🍿 cinema')
@Controller('/cinema')
export class CinemaController extends BaseResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly cinemaService: CinemaService,
    private readonly cinemaOrderService: CinemaOrderService,
    private readonly cinemaTicketService: CinemaTicketService,
    private readonly usersService: UsersService
  ) {
    super();
  }

  @ApiOperation({ summary: 'Получить фильмы' })
  @ApiResponse({
    type: FilmsResponse,
    description: 'films',
    status: 200
  })
  @Get('/films')
  getCinemaToday(): FilmsResponse {
    const films = this.cinemaService.getFilms();
    return this.wrapSuccess({ films });
  }

  @ApiOperation({ summary: 'Получить фильм' })
  @ApiResponse({
    type: FilmResponse,
    description: 'film',
    status: 200
  })
  @Get('/film/:filmId')
  getFilm(@Param() getFilmDto: GetFilmDto): FilmResponse {
    const film = this.cinemaService.getFilm(getFilmDto.filmId);

    if (!film) {
      throw new BadRequestException(this.wrapFail('Фильм не найден'));
    }

    return this.wrapSuccess({ film });
  }

  @ApiOperation({ summary: 'Получить расписание фильма' })
  @ApiResponse({
    type: ScheduleResponse,
    description: 'schedule',
    status: 200
  })
  @Get('/film/:filmId/schedule')
  async getFilmSchedule(@Param() getScheduleDto: GetScheduleDto): Promise<ScheduleResponse> {
    const filmSchedule = this.cinemaService.getFilmSchedule(getScheduleDto.filmId);
    const tickets = await this.cinemaTicketService.find({ filmId: getScheduleDto.filmId });

    const updatedFilmSchedule = filmSchedule.reduce(
      (acc, schedule, index) => {
        const formattedDate = getDDMMYYFormatDate(index);

        const seances = schedule.map((seance) => {
          const updatedPlaces = structuredClone(seance.hall.places);
          const paidTickets = tickets.filter(
            (ticket) =>
              ticket.seance.date === formattedDate &&
              ticket.seance.time === seance.time &&
              ticket.filmId === getScheduleDto.filmId
          );

          if (paidTickets.length) {
            paidTickets.forEach((ticket) => {
              updatedPlaces[ticket.row - 1][ticket.column - 1].type = FilmHallCellType.PAID;
            });
          }

          return { ...seance, hall: { ...seance.hall, places: updatedPlaces } };
        });

        acc.push({ date: formattedDate, seances });

        return acc;
      },
      [] as ScheduleResponse['schedules']
    );

    return this.wrapSuccess({ schedules: updatedFilmSchedule });
  }

  @ApiOperation({ summary: 'Оплатить билеты' })
  @ApiResponse({
    type: PaymentResponse,
    description: 'payment',
    status: 200
  })
  @Post('/payment')
  async createCinemaPayment(
    @Args('input') createCinemaPaymentDto: CreateCinemaPaymentDto
  ): Promise<PaymentResponse> {
    const { person } = createCinemaPaymentDto;

    const formattedTickets = createCinemaPaymentDto.tickets.map((ticket) => ({
      filmId: createCinemaPaymentDto.filmId,
      seance: createCinemaPaymentDto.seance,
      phone: createCinemaPaymentDto.person.phone,
      row: ticket.row,
      column: ticket.column,
      status: CinemaTicketStatus.PAID
    }));

    const existedTickets = [];
    await Promise.all(
      formattedTickets.map(async (ticket) => {
        const existedTicket = await this.cinemaTicketService.findOne({
          'seance.date': ticket.seance.date,
          'seance.time': ticket.seance.time,
          row: ticket.row,
          column: ticket.column
        });

        if (existedTicket) {
          existedTickets.push(ticket);
        }
      })
    );

    if (existedTickets.length) {
      throw new BadRequestException(
        this.wrapFail(
          `Данные билеты уже куплены: ${existedTickets
            .map(
              (ticket, index) =>
                `${index + 1}. ${ticket.seance.date} ${ticket.seance.time} ${ticket.row} ${
                  ticket.column
                }`
            )
            .join(' ')}`,
          {
            tickets: existedTickets.map((ticket) => ({
              seance: ticket.seance,
              row: ticket.row,
              column: ticket.column,
              status: ticket.status
            }))
          }
        )
      );
    }

    const film = this.cinemaService.getFilm(createCinemaPaymentDto.filmId);

    const orderNumber = Math.floor(Math.random() * 10 ** 6);
    const order = await this.cinemaOrderService.create({
      film,
      orderNumber,
      tickets: [],
      person,
      status: CinemaOrderStatus.PAID
    });

    const tickets = await this.cinemaTicketService.insertMany(
      formattedTickets.map((ticket) => ({
        ...ticket,
        orderId: order._id.toString()
      }))
    );

    await this.cinemaOrderService.updateOne({ _id: order._id }, { $set: { tickets } });

    let user = await this.usersService.findOne({ phone: person.phone });

    if (!user) {
      user = await this.usersService.create({ phone: person.phone });
    }

    await this.usersService.findOneAndUpdate(
      { phone: user.phone },
      {
        $set: {
          firstname: person.firstname,
          lastname: person.lastname,
          middlename: person.middlename
        }
      }
    );

    const returnedOrder = await this.cinemaOrderService.findOne({ _id: order._id });

    return this.wrapSuccess({ order: returnedOrder });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить заказы' })
  @ApiResponse({
    type: CinemaOrdersResponse,
    description: 'orders',
    status: 200
  })
  @Get('/orders')
  @AuthorizedOnly()
  async getCinemaOrders(@Req() req: FastifyRequest): Promise<CinemaOrdersResponse> {
    const token = req.headers.authorization?.split(' ')[1];
    const decodedJwtAccessToken = (await this.authService.decode(token)) as User;

    if (!decodedJwtAccessToken) {
      throw new BadRequestException(this.wrapFail('Некорректный токен авторизации'));
    }

    const orders = await this.cinemaOrderService.find({
      'person.phone': decodedJwtAccessToken.phone
    });

    return this.wrapSuccess({ orders });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отменить заказ' })
  @ApiResponse({
    type: BaseResponse,
    description: 'order cancel',
    status: 200
  })
  @Put('/orders/cancel')
  @AuthorizedOnly()
  async cancelCinemaOrder(
    @Body() cancelCinemaOrderDto: CancelCinemaOrderDto
  ): Promise<BaseResponse> {
    const order = await this.cinemaOrderService.findOne({ _id: cancelCinemaOrderDto.orderId });

    if (!order) {
      throw new BadRequestException(this.wrapFail('Заказ не найден'));
    }

    if (order.status !== CinemaOrderStatus.PAID) {
      throw new BadRequestException(this.wrapFail('Заказ нельзя отменить'));
    }

    await this.cinemaTicketService.updateMany(
      { _id: { $in: order.tickets.map((ticket) => ticket._id) } },
      { $set: { status: CinemaTicketStatus.CANCELLED } }
    );

    const updatedTickets = await this.cinemaTicketService.find({
      _id: { $in: order.tickets.map((ticket) => ticket._id) }
    });

    await this.cinemaOrderService.updateOne(
      { _id: cancelCinemaOrderDto.orderId },
      { $set: { status: CinemaOrderStatus.CANCELED, tickets: updatedTickets } }
    );

    return this.wrapSuccess();
  }
}
