import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '@/utils/base';

@ObjectType()
export class CreateOtpResponse extends BaseResponse {
  @ApiProperty({ description: 'Время запроса повторного отп кода в мс', example: 120000 })
  @Field(() => Number)
  retryDelay: number;
}
