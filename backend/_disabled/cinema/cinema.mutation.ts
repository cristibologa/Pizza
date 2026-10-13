import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UsersService } from '@/modules/users';
import { DescribeContext } from '@/utils/decorators';
import { AuthorizedOnlyGuard } from '@/modules/auth';
import { BaseResolver, BaseResponse } from '@/utils/services';

import { PaymentResponse } from './cinema.model';
import { CinemaService } from './cinema.service';
import { CancelCinemaOrderDto, CreateCinemaPaymentDto } from './dto';
import {
  CinemaOrderService,
  CinemaOrderStatus,
  CinemaTicketService,
  CinemaTicketStatus
} from './modules';

@DescribeContext('CinemaMutation')
@Resolver('🍿 cinema mutation')
@Resolver()
export class CinemaMutation extends BaseResolver {
  constructor(
    private readonly cinemaService: CinemaService,
    private readonly cinemaOrderService: CinemaOrderService,
    private readonly usersService: UsersService,
    private readonly cinemaTicketService: CinemaTicketService
  ) {
    super();
  }

  @Mutation(() => BaseResponse)
  @AuthorizedOnly()
  async cancelCinemaOrder(
    @Args('input') cancelCinemaOrderDto: CancelCinemaOrderDto
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

  @Mutation(() => PaymentResponse)
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
}
