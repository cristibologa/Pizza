import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class GetGameOrderDto {
  @ApiProperty({ description: 'ID заказа' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
