import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ArgsType()
export class SignInDto {
  @ApiProperty({ description: 'Номер телефона', example: '89990009999' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Отп код' })
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  code: number;
}
