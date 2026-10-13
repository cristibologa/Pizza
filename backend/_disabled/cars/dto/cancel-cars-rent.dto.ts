import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class CancelCarRentDto {
  @ApiProperty({ description: 'Идентификатор аренды' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  carRentId: string;
}
