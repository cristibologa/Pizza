import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class BaseResponse {
  @ApiProperty({ description: 'Статус запроса', example: true, enum: [true] })
  @Field(() => Boolean)
  success: true;

  @ApiProperty({ description: 'Причина ошибки', required: false })
  @Field(() => String, { nullable: true })
  reason?: string;
}
