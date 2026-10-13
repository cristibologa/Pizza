import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PizzaStatus } from './pizza-orders.enums';
import { PizzaOrdersService } from './pizza-orders.service';

const NEXT_STATUS: Partial<Record<PizzaStatus, PizzaStatus>> = {
  [PizzaStatus.IN_PROCESSING]: PizzaStatus.WAITING_COURIER,
  [PizzaStatus.WAITING_COURIER]: PizzaStatus.ON_MY_WAY,
  [PizzaStatus.ON_MY_WAY]: PizzaStatus.SUCCESS
};

@Injectable()
export class PizzaOrdersCron {
  private readonly logger = new Logger(PizzaOrdersCron.name);

  constructor(private readonly pizzaOrdersService: PizzaOrdersService) {}

  @Cron(CronExpression.EVERY_MINUTE, { name: 'pizza-orders-progress' })
  async progressOrders(): Promise<void> {
    const orders = await this.pizzaOrdersService.findMany({
      status: { $in: Object.keys(NEXT_STATUS) as PizzaStatus[] }
    });

    const randomOrders = orders.filter(() => Math.random() < 0.3);
    if (!randomOrders.length) return;

    let updated = 0;

    for (const order of randomOrders) {
      const nextStatus = NEXT_STATUS[order.status];
      if (!nextStatus) continue;

      await this.pizzaOrdersService.updateById(order._id, {
        status: nextStatus,
        cancellable: false
      });
      updated += 1;
    }

    updated && this.logger.log(`PIZZA PROGRESS CRON: updated ${updated}`);
  }
}
