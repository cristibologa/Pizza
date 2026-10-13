import { BadRequestException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';

import { AuthorizedOnlyGuard } from '@/modules/auth';
import { BaseResolver, BaseResponse } from '@/utils/services';

import { User, UsersService } from '../users';
import {
  CarRentResponse,
  CarRentsResponse,
  CarResponse,
  CarsPaginatedResponse
} from './cars.model';
import { CarsService } from './cars.service';
import { CancelCarRentDto, CreateRentDto, GetCarDto, GetCarRentDto, GetCarsSearchDto } from './dto';
import { CarRentService, CarRentStatus } from './modules';

@Resolver('🏎️ cars')
export class CarsMutation extends BaseResolver {
  constructor(
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

  @Mutation(() => CarRentResponse)
  async createCarRent(@Args('input') createCarRentDto: CreateRentDto): Promise<CarRentResponse> {
    const { phone } = createCarRentDto;

    const startDate = new Date(Number(createCarRentDto.startDate));
    const endDate = new Date(Number(createCarRentDto.endDate));

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      throw new BadRequestException(
        this.wrapFail('Дата начала аренды не может быть раньше сегодняшнего дня')
      );
    }

    const rentalDurationMs = endDate.getTime() - startDate.getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const rentalDays = rentalDurationMs / oneDayMs + 1;
    if (rentalDays < 1) {
      throw new BadRequestException(this.wrapFail('Аренда должна быть минимум 1 день'));
    }

    const car = this.carsService.getCar(createCarRentDto.carId);

    if (!car) {
      throw new BadRequestException(this.wrapFail('Автомобиль не найден'));
    }

    const overlappingRents = await this.carRentService.find({
      'carInfo.id': createCarRentDto.carId,
      status: CarRentStatus.BOOKED,
      startDate: { $lte: endTimestamp },
      endDate: { $gte: startTimestamp }
    });

    if (overlappingRents.length) {
      throw new BadRequestException(
        this.wrapFail('Выбранные даты пересекаются с уже существующей арендой')
      );
    }

    let user = await this.usersService.findOne({ phone });

    if (!user) {
      user = await this.usersService.create({ phone });
    }

    await this.carRentService.updateMany(
      {
        phone: user.phone,
        status: CarRentStatus.BOOKED
      },
      {
        $set: { status: CarRentStatus.CANCELLED }
      }
    );

    await this.usersService.findOneAndUpdate(
      { phone: user.phone },
      {
        $set: {
          firstname: createCarRentDto.firstName,
          lastname: createCarRentDto.lastName,
          middlename: createCarRentDto.middleName
        }
      }
    );

    const rent = await this.carRentService.create({
      ...createCarRentDto,
      status: CarRentStatus.BOOKED,
      totalPrice: rentalDays * car.price,
      carInfo: car
    });

    return this.wrapSuccess({ rent });
  }

  @Mutation(() => BaseResponse)
  @AuthorizedOnly()
  async cancelCarRent(
    @Args('input') cancelCarRentDto: CancelCarRentDto,
    @Context() context: { req: FastifyRequest }
  ): Promise<BaseResponse> {
    const token = context.req.headers.authorization.split(' ')[1];
    const decodedJwtAccessToken = (await this.authService.decode(token)) as User;

    if (!decodedJwtAccessToken) {
      throw new BadRequestException(this.wrapFail('Некорректный токен авторизации'));
    }

    const order = await this.carRentService.findOne({
      _id: cancelCarRentDto.carRentId
    });

    if (!order) {
      throw new BadRequestException(this.wrapFail('Аренда не найдена'));
    }

    await this.carRentService.updateOne(
      { _id: cancelCarRentDto.carRentId },
      { $set: { status: CarRentStatus.CANCELLED } }
    );

    return this.wrapSuccess();
  }
}
