import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '@/modules/users';
import { BaseResponse } from '@/utils/base';

@ObjectType()
export class SignInResponse extends BaseResponse {
  @ApiProperty({ description: 'Токен сессии' })
  @Field(() => String)
  token?: string;

  @ApiProperty({ type: User, description: 'Пользователь' })
  @Field(() => User)
  user: User;
}
