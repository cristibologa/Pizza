import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomBytes } from 'node:crypto';

import { CardsService } from '@/modules/cards';
import { BaseService } from '@/utils/base';
import { Result } from '@/utils/helpers';

import { PayTransactionDto } from './dto';
import { TransactionEntitySchema } from './transaction.schema';
import {
  TransactionOrderType,
  TransactionPayMethod,
  TransactionStatus
} from './transactions.enums';
import { TRANSACTION_EVENTS, TransactionPaidEvent } from './transactions.events';

const TRANSACTION_TTL_MS = 10 * 60 * 1000;
const ORDER_ACCESS_TOKEN_BYTES = 32;

export interface CreateTransactionParams {
  amount: number;
  backUrl?: string | null;
  currency: string;
  orderId: string;
  orderSnapshot?: Record<string, unknown> | null;
  orderType: TransactionOrderType;
  phone: string;
}

@Injectable()
export class TransactionsService extends BaseService<TransactionEntitySchema> {
  constructor(
    @InjectModel(TransactionEntitySchema.name)
    private readonly transactionModel: Model<TransactionEntitySchema>,
    private readonly cardsService: CardsService,
    private readonly eventEmitter: EventEmitter2
  ) {
    super(transactionModel);
  }

  async getTransaction(transactionId: string) {
    if (!Types.ObjectId.isValid(transactionId)) {
      throw new BadRequestException(Result.fail('Некорректный ID транзакции'));
    }

    const transaction = await this.findById(transactionId);

    if (!transaction) {
      throw new BadRequestException(Result.fail('Транзакция не найдена'));
    }

    if (transaction.status === TransactionStatus.PAID) {
      throw new BadRequestException(Result.fail('Транзакция уже оплачена'));
    }

    return transaction;
  }

  async createTransaction(params: CreateTransactionParams) {
    const now = Date.now();

    const transaction = await this.create({
      phone: params.phone,
      orderId: params.orderId,
      orderType: params.orderType,
      amount: params.amount,
      currency: params.currency,
      status: TransactionStatus.PENDING,
      expiresAt: new Date(now + TRANSACTION_TTL_MS)
    });

    return transaction;
  }

  async markPaid(transactionId: string, cardCryptoPacket?: string | null) {
    const transaction = await this.getTransaction(transactionId);

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException(Result.fail('Транзакция уже обработана'));
    }

    if (transaction.expiresAt && transaction.expiresAt.getTime() < Date.now()) {
      await this.updateById(transactionId, { status: TransactionStatus.FAILED });
      throw new BadRequestException(Result.fail('Срок действия транзакции истёк'));
    }

    const updated = await this.updateById(transactionId, {
      status: TransactionStatus.PAID,
      paidAt: new Date(),
      cardCryptoPacket: cardCryptoPacket ?? transaction.cardCryptoPacket ?? null
    });

    return updated;
  }

  async deleteTransactions(transactionIds: string[]) {
    if (!transactionIds.length) return 0;

    const { deletedCount } = await this.transactionModel.deleteMany({
      _id: { $in: transactionIds }
    });

    return deletedCount ?? 0;
  }

  private async assertPayable(transactionId: string) {
    const transaction = await this.getTransaction(transactionId);

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException(Result.fail('Транзакция уже обработана'));
    }

    if (transaction.expiresAt && transaction.expiresAt.getTime() < Date.now()) {
      await this.updateById(transactionId, { status: TransactionStatus.FAILED });
      throw new BadRequestException(Result.fail('Срок действия транзакции истёк'));
    }

    return transaction;
  }

  async payTransaction(payTransactionDto: PayTransactionDto) {
    const transaction = await this.assertPayable(payTransactionDto.transactionId);

    let cardCryptoPacket: string | null = null;

    switch (payTransactionDto.method) {
      case TransactionPayMethod.NEW_CARD: {
        if (!payTransactionDto.pan || !payTransactionDto.expireDate || !payTransactionDto.cvv) {
          throw new BadRequestException(Result.fail('Не заполнены данные карты'));
        }

        const shouldSave = payTransactionDto.saveCard !== false;
        if (shouldSave) {
          const card = await this.cardsService.saveCard({
            phone: transaction.phone,
            pan: payTransactionDto.pan,
            expireDate: payTransactionDto.expireDate,
            cvv: payTransactionDto.cvv
          });
          cardCryptoPacket = card.cryptoPacket;
        } else {
          cardCryptoPacket = await this.cardsService.buildCryptoPacket({
            pan: payTransactionDto.pan,
            expireDate: payTransactionDto.expireDate,
            cvv: payTransactionDto.cvv
          });
        }
        break;
      }

      case TransactionPayMethod.SAVED_CARD: {
        if (!payTransactionDto.cardId || !payTransactionDto.cvv) {
          throw new BadRequestException(Result.fail('Не указана карта или CVV'));
        }

        const card = await this.cardsService.refreshCardData(
          transaction.phone,
          payTransactionDto.cardId,
          payTransactionDto.cvv
        );
        cardCryptoPacket = card.cryptoPacket;
        break;
      }

      default:
        throw new BadRequestException(Result.fail('Неизвестный способ оплаты'));
    }

    return this.finalizePaid(transaction, cardCryptoPacket);
  }

  async payTransactionByQr(transactionId: string) {
    const transaction = await this.assertPayable(transactionId);

    return this.finalizePaid(transaction, null);
  }

  async consumeOrderAccessToken(accessToken: string, orderType: TransactionOrderType) {
    if (!accessToken) {
      throw new BadRequestException(Result.fail('Не указан токен доступа'));
    }

    const transaction = await this.transactionModel
      .findOneAndUpdate(
        {
          accessToken,
          orderType
        },
        {
          $set: {
            accessToken: null
          }
        },
        { returnDocument: 'after' }
      )
      .lean()
      .exec();

    if (!transaction) {
      throw new BadRequestException(Result.fail('Недействительный токен доступа'));
    }

    return transaction;
  }

  private async finalizePaid(
    transaction: Awaited<ReturnType<TransactionsService['getTransaction']>>,
    cardCryptoPacket: string | null
  ) {
    const accessToken = randomBytes(ORDER_ACCESS_TOKEN_BYTES).toString('hex');

    const updatedTransaction = await this.updateById(String(transaction._id), {
      status: TransactionStatus.PAID,
      paidAt: new Date(),
      cardCryptoPacket: cardCryptoPacket ?? null,
      accessToken
    });

    if (!updatedTransaction) {
      throw new BadRequestException(Result.fail('Не смогли изменить транзакцию'));
    }

    if (updatedTransaction.orderId) {
      await this.eventEmitter.emitAsync(TRANSACTION_EVENTS.PAID, {
        orderId: updatedTransaction.orderId,
        orderType: updatedTransaction.orderType,
        transactionId: String(updatedTransaction._id)
      } satisfies TransactionPaidEvent);
    }

    return Result.success({ transaction: updatedTransaction });
  }
}
