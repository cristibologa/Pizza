import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { randomUUID } from 'node:crypto';

import { UsersService } from '@/modules/users';
import { DescribeContext } from '@/utils/decorators';
import { AuthorizedOnlyGuard } from '@/modules/auth';
import { BaseResolver, BaseResponse } from '@/utils/services';

import type { DeliveryOption } from './entities';

import { CalculateDeliveryResponse, DeliverResponse } from './delivery.model';
import { DeliveryService } from './delivery.service';
import { CalculateDeliveryDto, CancelDeliveryOrderDto, CreateDeliveryOrderDto } from './dto';
import { DeliveryOptionType } from './entities';
import { calculateDelivery } from './helpers';
import { DeliveryOrderService, DeliveryStatus } from './modules';

@DescribeContext('DeliveryMutation')
@Resolver('📦 delivery mutation')
@Resolver()
export class DeliveryMutation extends BaseResolver {
  constructor(
    private readonly deliveryService: DeliveryService,
    private readonly deliveryOrderService: DeliveryOrderService,
    private readonly usersService: UsersService
  ) {
    super();
  }

  @Mutation(() => BaseResponse)
  @AuthorizedOnly()
  async cancelDeliveryOrder(
    @Args('input') cancelDeliveryOrderDto: CancelDeliveryOrderDto
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

  @Mutation(() => DeliverResponse)
  async createDeliveryOrder(
    @Args('input') createDeliveryOrderDto: CreateDeliveryOrderDto
  ): Promise<DeliverResponse> {
    const { sender, senderPointId, receiverPointId, receiver } = createDeliveryOrderDto;

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
      package: packageType,
      senderPoint,
      receiverPoint,
      sender,
      receiver,
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

  @Mutation(() => CalculateDeliveryResponse)
  async calculateDelivery(
    @Args('input') calculateDeliveryDto: CalculateDeliveryDto
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
        name: 'стандартная доставка',
        type: DeliveryOptionType.DEFAULT
      },
      {
        id: randomUUID(),
        price: price * 2,
        days: Math.floor(days / 2),
        name: 'экспресс доставка',
        type: DeliveryOptionType.EXPRESS
      }
    ];

    return this.wrapSuccess({ options });
  }
}
