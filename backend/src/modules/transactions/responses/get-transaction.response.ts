import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '@/utils/base';

import { Transaction } from '../transaction.entity';

@ObjectType()
export class GetTransactionResponse extends BaseResponse {
  @ApiProperty({ type: Transaction, description: 'Транзакция' })
  @Field(() => Transaction)
  transaction: Transaction;
}
