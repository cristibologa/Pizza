import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class GetGamePaidOrderDto {
  @ApiProperty({
    description: 'Одноразовый токен доступа к заказу после оплаты',
    example: '1f2e3d4c5b6a7980abcdef1234567890abcdef1234567890abcdef1234567890'
  })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  token: string;
}
