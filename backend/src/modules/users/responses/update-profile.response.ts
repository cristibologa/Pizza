import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '@/utils/base';

import { User } from '../user.entity';

@ObjectType()
export class UpdateProfileResponse extends BaseResponse {
  @ApiProperty({ type: User, description: 'Пользователь' })
  @Field(() => User)
  user: User;
}
