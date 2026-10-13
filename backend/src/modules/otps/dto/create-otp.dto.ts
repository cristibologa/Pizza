import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class CreateOtpDto {
  @ApiProperty({ description: 'Номер телефона', example: '89990009999' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  phone: string;
}
