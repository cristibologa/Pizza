import type { FastifyRequest } from 'fastify';

import { BadRequestException } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { AuthorizedOnlyGuard } from '@/modules/auth';
import { AuthService, BaseResolver } from '@/utils/services';

import type { User } from '../users';

import { UsersService } from '../users';
import { CarRentsResponse, CarResponse, CarsPaginatedResponse } from './cars.model';
import { CarsService } from './cars.service';
import { GetCarDto, GetCarRentDto, GetCarsSearchDto } from './dto';
import { CarRentService, CarRentStatus } from './modules';

@Resolver('🏎️ cars query')
export class CarsQuery extends BaseResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly carRentService: CarRentService,
    private readonly carsService: CarsService
  ) {
    super();
  }

  @Query(() => CarsPaginatedResponse)
  getCars(@Args('input') getCarsQuery: GetCarsSearchDto): CarsPaginatedResponse {
    const filteredCars = this.carsService.getFilteredCars({ filters: getCarsQuery });
    const paginatedCars = this.carsService.getPagination({
      items: filteredCars,
      page: getCarsQuery.page,
      limit: getCarsQuery.limit
    });

    return this.wrapSuccess(paginatedCars);
  }

  @Query(() => CarResponse)
  async getCar(@Args('input') getCarDto: GetCarDto): Promise<CarResponse> {
    const car = this.carsService.getCar(getCarDto.carId);

    if (!car) {
      throw new BadRequestException(this.wrapFail('Автомобиль не найден'));
    }

    const carRents = await this.carRentService.find({
      'carInfo.id': getCarDto.carId,
      status: CarRentStatus.BOOKED
    });

    const rents = carRents.map((rent) => ({
      startDate: new Date(rent.startDate).getTime(),
      endDate: new Date(rent.endDate).getTime()
    }));

    return this.wrapSuccess({
      data: { ...car, rents }
    });
  }

  @Query(() => CarRentsResponse)
  @AuthorizedOnly()
  async getCarRents(@Context() context: { req: FastifyRequest }): Promise<CarRentsResponse> {
    const token = context.req.headers.authorization.split(' ')[1];
    const decodedJwtAccessToken = (await this.authService.decode(token)) as User;

    if (!decodedJwtAccessToken) {
      throw new BadRequestException(this.wrapFail('Некорректный токен авторизации'));
    }

    const rents = await this.carRentService.find({
      phone: decodedJwtAccessToken.phone
    });

    return this.wrapSuccess({ rents });
  }

  @Query(() => CarResponse)
  @AuthorizedOnly()
  async getCarRent(
    @Args('input') getCarRentDto: GetCarRentDto,
    @Context() context: { req: FastifyRequest }
  ) {
    const token = context.req.headers.authorization.split(' ')[1];
    const decodedJwtAccessToken = (await this.authService.decode(token)) as User;

    if (!decodedJwtAccessToken) {
      throw new BadRequestException(this.wrapFail('Некорректный токен авторизации'));
    }

    const rent = await this.carRentService.findOne({
      _id: getCarRentDto.carRentId
    });

    if (!rent) {
      throw new BadRequestException(this.wrapFail('Аренда не найдена'));
    }

    return this.wrapSuccess({ rent });
  }
}
