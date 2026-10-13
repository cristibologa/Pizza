import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import type { TransactionExpiredEvent, TransactionPaidEvent } from '@/modules/transactions';

import { TRANSACTION_EVENTS, TransactionOrderType } from '@/modules/transactions';

import { PizzaOrdersService } from './pizza-orders.service';

@Injectable()
export class PizzaOrdersListener {
  private readonly logger = new Logger(PizzaOrdersListener.name);

  constructor(private readonly pizzaOrdersService: PizzaOrdersService) {}

  @OnEvent(TRANSACTION_EVENTS.PAID)
  async onTransactionPaid({ orderId, orderType }: TransactionPaidEvent) {
    if (orderType !== TransactionOrderType.PIZZA) return;

    await this.pizzaOrdersService.handlePaidTransaction(orderId);
  }

  @OnEvent(TRANSACTION_EVENTS.EXPIRED)
  async onTransactionsExpired({ orders }: TransactionExpiredEvent) {
    const orderIds = orders
      .filter(({ orderType }) => orderType === TransactionOrderType.PIZZA)
      .map(({ orderId }) => orderId);

    const deletedOrders = await this.pizzaOrdersService.deleteStaleOrders(orderIds);

    deletedOrders && this.logger.log(`PIZZA ORDERS: deleted ${deletedOrders} stale orders`);
  }
}
