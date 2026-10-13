import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseService } from '@/utils/base';
import { Result } from '@/utils/helpers';

import { GameDeliveryType } from '../../constants';
import { GameOrderStatus } from './game-order.enums';
import { GameOrderEntitySchema } from './game-order.schema';

@Injectable()
export class GameOrderService extends BaseService<GameOrderEntitySchema> {
  constructor(
    @InjectModel(GameOrderEntitySchema.name)
    private gameOrderModel: Model<GameOrderEntitySchema>
  ) {
    super(gameOrderModel);
  }

  generateGameKey(): string {
    const randomChunk = () => Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${randomChunk()}-${randomChunk()}-${randomChunk()}-${randomChunk()}`;
  }

  async findUserPaidOrders(phone: string) {
    return this.gameOrderModel
      .find({
        'person.phone': phone,
        status: { $ne: GameOrderStatus.AWAITING_PAYMENT }
      })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
  }

  async handlePaidTransaction(orderId: string) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new BadRequestException(Result.fail(`Заказ ${orderId} не найден`));
    }

    if (order.deliveryType === GameDeliveryType.STEAM_GIFT) {
      return this.updateById(orderId, { status: GameOrderStatus.PAID });
    }

    return this.updateById(orderId, {
      status: GameOrderStatus.PAID,
      gameKey: this.generateGameKey()
    });
  }

  async deleteStaleOrders(orderIds: string[]) {
    if (!orderIds.length) return 0;

    const { deletedCount } = await this.gameOrderModel.deleteMany({
      _id: { $in: orderIds },
      status: GameOrderStatus.AWAITING_PAYMENT
    });

    return deletedCount ?? 0;
  }
}
