import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class CancelPizzaOrderDto {
  @ApiProperty({ description: 'Идентификатор заказа' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
