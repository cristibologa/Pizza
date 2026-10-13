import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '@/utils/base';

import { Transaction } from '../transaction.entity';

@ObjectType()
export class PayTransactionResponse extends BaseResponse {
  @ApiProperty({ type: Transaction, description: 'Оплаченная транзакция' })
  @Field(() => Transaction)
  transaction: Transaction;
}
