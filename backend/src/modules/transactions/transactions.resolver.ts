import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Result } from '@/utils/helpers';

import { GetTransactionDto, PayTransactionDto } from './dto';
import { GetTransactionResponse, PayTransactionResponse } from './responses';
import { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query(() => GetTransactionResponse)
  async getTransaction(
    @Args() getTransactionDto: GetTransactionDto
  ): Promise<GetTransactionResponse> {
    const transaction = await this.transactionsService.getTransaction(
      getTransactionDto.transactionId
    );
    return Result.success({
      transaction
    });
  }

  @Mutation(() => PayTransactionResponse, {
    description: 'Оплатить транзакцию: новая карта / сохранённая карта'
  })
  async payTransaction(
    @Args() payTransactionDto: PayTransactionDto
  ): Promise<PayTransactionResponse> {
    return this.transactionsService.payTransaction(payTransactionDto);
  }

  @Mutation(() => PayTransactionResponse, {
    description: 'Оплатить транзакцию по QR'
  })
  async payTransactionByQr(
    @Args('transactionId') transactionId: string
  ): Promise<PayTransactionResponse> {
    return this.transactionsService.payTransactionByQr(transactionId);
  }
}
