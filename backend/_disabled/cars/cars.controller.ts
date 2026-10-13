import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/utils/decorators/current-user.decorator';
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
import { BodyType, Brand, Color, Transmission } from './constants/enums';
import { CancelCarRentDto, CreateRentDto, GetCarDto, GetCarRentDto, GetCarsSearchDto } from './dto';
import { CarRent, CarRentService, CarRentStatus } from './modules';

@ApiTags('🏎️ cars')
@Controller('/cars')
export class CarsController extends BaseResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly carRentService: CarRentService,
    private readonly carsService: CarsService
  ) {
    super();
  }

  @ApiOperation({ summary: 'Получить автомобили' })
  @ApiQuery({
    type: Number,
    description: 'Номер текущей страницы (по умолчанию 1)',
    required: false,
    name: 'page'
  })
  @ApiQuery({
    type: Number,
    description: 'Количество элементов на странице (по умолчанию 10)',
    required: false,
    name: 'limit'
  })
  @ApiQuery({
    description: 'Цвет автомобиля',
    example: Color.BLACK,
    enum: Color,
    required: false,
    enumName: 'Color',
    name: 'color'
  })
  @ApiQuery({
    description: 'Марка автомобиля',
    example: Brand.HAVAL,
    enum: Brand,
    required: false,
    enumName: 'Brand',
    name: 'brand'
  })
  @ApiQuery({
    description: 'Тип кузова автомобиля',
    example: BodyType.SEDAN,
    enum: BodyType,
    required: false,
    enumName: 'BodyType',
    name: 'bodyType'
  })
  @ApiQuery({
    description: 'Тип трансмиссии',
    example: Transmission.AUTOMATIC,
    enum: Transmission,
    required: false,
    enumName: 'Transmission',
    name: 'transmission'
  })
  @ApiQuery({
    type: Number,
    description: 'Минимальная цена аренды',
    required: false,
    name: 'minPrice'
  })
  @ApiQuery({
    type: Number,
    description: 'Максимальная цена аренды',
    required: false,
    name: 'maxPrice'
  })
  @ApiQuery({
    type: String,
    description: 'Поиск',
    required: false,
    name: 'search'
  })
  @ApiResponse({
    type: CarsPaginatedResponse,
    status: 200
  })
  @Get('/info')
  getCars(@Query() getCarsQuery: GetCarsSearchDto): CarsPaginatedResponse {
    const filteredCars = this.carsService.getFilteredCars({ filters: getCarsQuery });
    const paginatedCars = this.carsService.getPagination({
      items: filteredCars,
      page: getCarsQuery.page,
      limit: getCarsQuery.limit
    });

    return this.wrapSuccess(paginatedCars);
  }

  @ApiOperation({ summary: 'Получить автомобиль' })
  @ApiResponse({
    type: CarResponse,
    description: 'car with rents',
    status: 200
  })
  @Get('info/:carId')
  async getCar(@Param() params: GetCarDto): Promise<CarResponse> {
    const car = this.carsService.getCar(params.carId);

    if (!car) {
      throw new BadRequestException(this.wrapFail('Автомобиль не найден'));
    }

    const carRents = await this.carRentService.find({
      'carInfo.id': params.carId,
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

  @ApiOperation({ summary: 'Арендовать автомобиль' })
  @ApiResponse({
    type: CarRentResponse,
    description: 'create rent',
    status: 200
  })
  @Post('rent')
  async createCarRent(@Body() createCarRentDto: CreateRentDto) {
    const { phone } = createCarRentDto;

    const startDate = new Date(Number(createCarRentDto.startDate));
    const endDate = new Date(Number(createCarRentDto.endDate));

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

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
      startDate: { $lte: endDate.getTime() },
      endDate: { $gte: startDate.getTime() }
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все аренды' })
  @ApiResponse({
    type: CarRentsResponse,
    description: 'rents',
    status: 200
  })
  @Get('/rent')
  @AuthorizedOnly()
  async getCarRents(@CurrentUser() user: User): Promise<CarRentsResponse> {
    const rents = await this.carRentService.find({
      phone: user.phone
    });

    return this.wrapSuccess({ rents });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить аренду' })
  @ApiResponse({
    type: CarRent,
    description: 'rent',
    status: 200
  })
  @Get('/rent/:carRentId')
  @AuthorizedOnly()
  async getCarRent(@Param() params: GetCarRentDto): Promise<CarRent> {
    const rent = await this.carRentService.findOne({
      _id: params.carRentId
    });
    if (!rent) {
      throw new BadRequestException(this.wrapFail('Аренда не найдена'));
    }

    return rent;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отменить аренду' })
  @ApiResponse({
    type: BaseResponse,
    description: 'rent cancel',
    status: 200
  })
  @Put('/rent/cancel')
  @AuthorizedOnly()
  async cancelCarRent(@Body() cancelCarRentDto: CancelCarRentDto): Promise<BaseResponse> {
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
