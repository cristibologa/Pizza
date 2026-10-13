import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

import { TransactionPayMethod } from '../transactions.enums';

@ArgsType()
export class PayTransactionDto {
  @ApiProperty({ description: 'ID транзакции' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @ApiProperty({
    description: 'Способ оплаты',
    example: TransactionPayMethod.NEW_CARD,
    enum: TransactionPayMethod,
    enumName: 'TransactionPayMethod'
  })
  @Field(() => TransactionPayMethod)
  @IsEnum(TransactionPayMethod)
  method: TransactionPayMethod;

  @ApiProperty({ description: 'Номер карты (новая карта)', required: false })
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.method === TransactionPayMethod.NEW_CARD)
  pan?: string;

  @ApiProperty({ description: 'Срок действия (новая карта)', required: false })
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  @ValidateIf(({ method }) => method === TransactionPayMethod.NEW_CARD)
  expireDate?: string;

  @ApiProperty({ description: 'ID сохранённой карты', required: false })
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  @ValidateIf(({ method }) => method === TransactionPayMethod.SAVED_CARD)
  cardId?: string;

  @ApiProperty({ description: 'CVV (любой символ — фикция)', required: false })
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  @ValidateIf(
    ({ method }) =>
      method === TransactionPayMethod.NEW_CARD || method === TransactionPayMethod.SAVED_CARD
  )
  cvv?: string;

  @ApiProperty({ description: 'Сохранить новую карту', required: false, default: true })
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsOptional()
  saveCard?: boolean;
}
