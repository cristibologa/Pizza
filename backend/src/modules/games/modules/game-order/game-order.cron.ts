import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { TransactionsService, TransactionStatus } from '@/modules/transactions';

import { GameOrderStatus } from './game-order.enums';
import { GameOrderService } from './game-order.service';

@Injectable()
export class GameOrderCron {
  private readonly logger = new Logger(GameOrderCron.name);

  constructor(
    private readonly gameOrderService: GameOrderService,
    private readonly transactionsService: TransactionsService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, { name: 'game-orders-kill-stale' })
  async killStaleOrders(): Promise<void> {
    const awaitingOrders = await this.gameOrderService.findMany({
      status: GameOrderStatus.AWAITING_PAYMENT,
      transactionId: { $ne: null }
    });

    if (!awaitingOrders.length) return;

    const transactionIds = awaitingOrders.map(({ transactionId }) => transactionId);

    const deadTransactions = await this.transactionsService.findMany({
      _id: { $in: transactionIds },
      status: TransactionStatus.FAILED
    });

    if (!deadTransactions.length) return;

    const deadIds = deadTransactions.map(({ _id }) => String(_id));

    const deletedOrders = await this.gameOrderService.deleteStaleOrders(
      awaitingOrders
        .filter(({ transactionId }) => deadIds.includes(String(transactionId)))
        .map(({ _id }) => String(_id))
    );

    const deletedTransactions = await this.transactionsService.deleteTransactions(deadIds);

    this.logger.log(
      `GAME KILL STALE CRON: deleted ${deletedOrders} orders, ${deletedTransactions} transactions`
    );
  }
}
