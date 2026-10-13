import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import type { TransactionExpiredEvent, TransactionPaidEvent } from '@/modules/transactions';

import { TRANSACTION_EVENTS, TransactionOrderType } from '@/modules/transactions';

import { GameOrderService } from './game-order.service';

@Injectable()
export class GameOrderListener {
  private readonly logger = new Logger(GameOrderListener.name);

  constructor(private readonly gameOrderService: GameOrderService) {}

  @OnEvent(TRANSACTION_EVENTS.PAID)
  async onTransactionPaid({ orderId, orderType }: TransactionPaidEvent) {
    if (orderType !== TransactionOrderType.GAME) return;

    await this.gameOrderService.handlePaidTransaction(orderId);
  }

  @OnEvent(TRANSACTION_EVENTS.EXPIRED)
  async onTransactionsExpired({ orders }: TransactionExpiredEvent) {
    const orderIds = orders
      .filter(({ orderType }) => orderType === TransactionOrderType.GAME)
      .map(({ orderId }) => orderId);

    const deletedOrders = await this.gameOrderService.deleteStaleOrders(orderIds);

    deletedOrders && this.logger.log(`GAME ORDERS: deleted ${deletedOrders} stale orders`);
  }
}
