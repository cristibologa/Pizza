import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseService } from '@/utils/base';
import { Result } from '@/utils/helpers';

import { PizzaOrderEntitySchema } from './pizza-order.schema';
import { PizzaStatus } from './pizza-orders.enums';

@Injectable()
export class PizzaOrdersService extends BaseService<PizzaOrderEntitySchema> {
  constructor(
    @InjectModel(PizzaOrderEntitySchema.name)
    private pizzaOrderModel: Model<PizzaOrderEntitySchema>
  ) {
    super(pizzaOrderModel);
  }

  async handlePaidTransaction(orderId: string) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new BadRequestException(Result.fail(`Заказ ${orderId} не найден`));
    }

    return this.updateById(orderId, {
      status: PizzaStatus.IN_PROCESSING,
      cancellable: true
    });
  }

  async deleteStaleOrders(orderIds: string[]) {
    if (!orderIds.length) return 0;

    const { deletedCount } = await this.pizzaOrderModel.deleteMany({
      _id: { $in: orderIds },
      status: PizzaStatus.AWAITING_PAYMENT
    });

    return deletedCount ?? 0;
  }
}
