import type { FastifyRequest } from 'fastify';

import { BadRequestException, Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

import { AuthorizedOnlyGuard } from '@/modules/auth';
import { AuthService, BaseResolver, BaseResponse } from '@/utils/services';

import type { User } from '../users';
import type { DeliveryOption } from './entities';

import { UsersService } from '../users';
import {
  CalculateDeliveryResponse,
  DeliverResponse,
  DeliveryOrderResponse,
  DeliveryOrdersResponse,
  DeliveryPackageTypesResponse,
  DeliveryPointsResponse
} from './delivery.model';
import { DeliveryService } from './delivery.service';
import {
  CalculateDeliveryDto,
  CancelDeliveryOrderDto,
  CreateDeliveryOrderDto,
  GetDeliveryOrderDto
} from './dto';
import { DeliveryOptionType } from './entities';
import { calculateDelivery } from './helpers';
import { DeliveryOrderService, DeliveryStatus } from './modules';

@ApiTags('📦 delivery')
@Controller('/delivery')
export class DeliveryController extends BaseResolver {
  constructor(
    private readonly deliveryService: DeliveryService,
    private readonly deliveryOrderService: DeliveryOrderService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {
    super();
  }

  @ApiOperation({ summary: 'Получить пункты выдачи' })
  @ApiResponse({
    type: DeliveryPointsResponse,
    description: 'points',
    status: 200
  })
  @Get('/points')
  getPoints(): DeliveryPointsResponse {
    return this.wrapSuccess({ points: this.deliveryService.getDeliveryPoints() });
  }

  @ApiOperation({ summary: 'Получить типы посылок' })
  @ApiResponse({
    type: DeliveryPackageTypesResponse,
    description: 'package types',
    status: 200
  })
  @Get('/package/types')
  getPackageTypes(): DeliveryPackageTypesResponse {
    return this.wrapSuccess({ packages: this.deliveryService.getDeliveryPackageTypes() });
  }

  @ApiOperation({ summary: 'Расчет доставки' })
  @ApiResponse({
    type: CalculateDeliveryResponse,
    description: 'calc',
    status: 200
  })
  @Post('/calc')
  async calculateDelivery(
    @Body() calculateDeliveryDto: CalculateDeliveryDto
  ): Promise<CalculateDeliveryResponse> {
    const price = calculateDelivery({
      senderPointCoordinates: calculateDeliveryDto.senderPoint,
      receiverPointCoordinates: calculateDeliveryDto.receiverPoint,
      packageData: calculateDeliveryDto.package
    });

    const days = Math.floor(Math.random() * 7) + 2;

    const options: DeliveryOption[] = [
      {
        id: randomUUID(),
        days,
        price,
        name: 'Стандартная доставка',
        type: DeliveryOptionType.DEFAULT
      },
      {
        id: randomUUID(),
        price: price * 2,
        days: Math.floor(days / 2),
        name: 'Эксперсс доставка',
        type: DeliveryOptionType.EXPRESS
      }
    ];

    return this.wrapSuccess({ options });
  }

  @ApiOperation({ summary: 'Создание заявки доставки' })
  @ApiResponse({
    type: DeliverResponse,
    description: 'order',
    status: 200
  })
  @Post('/order')
  async createOrder(
    @Body() createDeliveryOrderDto: CreateDeliveryOrderDto
  ): Promise<DeliverResponse> {
    const { sender, senderPointId, receiverPointId, receiver, optionType } = createDeliveryOrderDto;

    const senderPoint = this.deliveryService.getDeliveryPoint(senderPointId);
    const receiverPoint = this.deliveryService.getDeliveryPoint(receiverPointId);
    const packageType = this.deliveryService.getDeliveryPackageType(
      createDeliveryOrderDto.packageId
    );

    if (!senderPoint || !receiverPoint || !packageType) {
      throw new BadRequestException(this.wrapFail('Некорректные данные'));
    }

    let price = calculateDelivery({
      senderPointCoordinates: senderPoint,
      receiverPointCoordinates: receiverPoint,
      packageData: packageType
    });

    if (createDeliveryOrderDto.optionType === DeliveryOptionType.EXPRESS) {
      price *= 2;
    }

    const order = await this.deliveryOrderService.create({
      price,
      option: optionType,
      package: packageType,
      senderPoint,
      receiverPoint,
      sender,
      receiver,
      senderAddress: createDeliveryOrderDto.senderAddress,
      receiverAddress: createDeliveryOrderDto.receiverAddress,
      payer: createDeliveryOrderDto.payer,
      status: DeliveryStatus.IN_PROCESSING,
      cancellable: true
    });

    let user = await this.usersService.findOne({ phone: sender.phone });

    if (!user) {
      user = await this.usersService.create({ phone: sender.phone });
    }

    await this.usersService.findOneAndUpdate(
      { phone: user.phone },
      {
        $set: {
          firstname: sender.firstname,
          lastname: sender.lastname,
          middlename: sender.middlename
        }
      }
    );

    return this.wrapSuccess({ order });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все заявки на доставку' })
  @ApiResponse({
    type: DeliveryOrdersResponse,
    description: 'orders',
    status: 200
  })
  @Get('/orders')
  @AuthorizedOnly()
  async getDeliveries(@Req() request: FastifyRequest): Promise<DeliveryOrdersResponse> {
    const token = request.headers.authorization.split(' ')[1];
    const decodedJwtAccessToken = (await this.authService.decode(token)) as User;

    if (!decodedJwtAccessToken) {
      throw new BadRequestException(this.wrapFail('Некорректный токен авторизации'));
    }

    const orders = await this.deliveryOrderService.find({
      $or: [
        { 'sender.phone': decodedJwtAccessToken.phone },
        { 'receiver.phone': decodedJwtAccessToken.phone }
      ]
    });

    return this.wrapSuccess({ orders });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить заявку на доставку' })
  @ApiResponse({
    type: DeliveryOrderResponse,
    description: 'order',
    status: 200
  })
  @Get('/orders/:orderId')
  @AuthorizedOnly()
  async getDelivery(
    @Param() getDeliveryOrderDto: GetDeliveryOrderDto,
    @Req() request: FastifyRequest
  ): Promise<DeliveryOrderResponse> {
    const token = request.headers.authorization.split(' ')[1];
    const decodedJwtAccessToken = (await this.authService.decode(token)) as User;

    if (!decodedJwtAccessToken) {
      throw new BadRequestException(this.wrapFail('Некорректный токен авторизации'));
    }

    const order = await this.deliveryOrderService.findOne({
      _id: getDeliveryOrderDto.orderId,
      $or: [
        { 'sender.phone': decodedJwtAccessToken.phone },
        { 'receiver.phone': decodedJwtAccessToken.phone }
      ]
    });

    if (!order) {
      throw new BadRequestException(this.wrapFail('Заказ не найден'));
    }

    return this.wrapSuccess({ order });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отменить доставку' })
  @ApiResponse({
    type: BaseResponse,
    description: 'order cancel',
    status: 200
  })
  @Put('/orders/cancel')
  @AuthorizedOnly()
  async cancelDeliveryOrder(
    @Body() cancelDeliveryOrderDto: CancelDeliveryOrderDto
  ): Promise<BaseResponse> {
    const order = await this.deliveryOrderService.findOne({ _id: cancelDeliveryOrderDto.orderId });

    if (!order) {
      throw new BadRequestException(this.wrapFail('Доставка не найдена'));
    }

    if (order.status > DeliveryStatus.IN_PROCESSING) {
      throw new BadRequestException(this.wrapFail('Доставка нельзя отменить'));
    }

    await this.deliveryOrderService.updateOne(
      { _id: cancelDeliveryOrderDto.orderId },
      { $set: { status: DeliveryStatus.CANCELED } }
    );

    return this.wrapSuccess();
  }
}
