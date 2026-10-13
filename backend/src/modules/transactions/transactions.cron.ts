import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';

import { TransactionEntitySchema } from './transaction.schema';
import { TransactionStatus } from './transactions.enums';
import { TRANSACTION_EVENTS, TransactionExpiredEvent } from './transactions.events';

@Injectable()
export class TransactionsCron {
  private readonly logger = new Logger(TransactionsCron.name);

  constructor(
    @InjectModel(TransactionEntitySchema.name)
    private readonly transactionModel: Model<TransactionEntitySchema>,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, { name: 'expire-transactions' })
  async expireTransactions() {
    const transactions = await this.transactionModel.find({
      status: TransactionStatus.PENDING,
      expiresAt: { $lt: new Date() }
    });

    if (!transactions.length) return;

    const expiredIds = transactions.map(({ _id }) => _id);

    await this.eventEmitter.emitAsync(TRANSACTION_EVENTS.EXPIRED, {
      orders: transactions
        .filter(({ orderId }) => Boolean(orderId))
        .map(({ _id, orderId, orderType }) => ({
          orderId: String(orderId),
          orderType,
          transactionId: String(_id)
        }))
    } satisfies TransactionExpiredEvent);

    const { deletedCount } = await this.transactionModel.deleteMany({ _id: { $in: expiredIds } });

    this.logger.log(`EXPIRE TRANSACTIONS CRON: deleted ${deletedCount} transactions`);
  }
}
