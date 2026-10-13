import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '@/utils/base';

@ObjectType()
export class DeleteCardResponse extends BaseResponse {
  @ApiProperty({ type: String, description: 'ID удаленной карты' })
  @Field(() => ID)
  id: string;
}
