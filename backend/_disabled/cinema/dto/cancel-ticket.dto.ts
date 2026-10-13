import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class CancelCinemaOrderDto {
  @ApiProperty({ description: 'Идентификатор билета' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
