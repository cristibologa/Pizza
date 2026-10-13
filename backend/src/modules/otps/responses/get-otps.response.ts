import { Field, ObjectType } from '@nestjs/graphql';

import { BaseResponse } from '@/utils/base';

import { Otp } from '../otp.entity';

@ObjectType()
export class GetOtpsResponse extends BaseResponse {
  @Field(() => [Otp])
  otps: Otp[];
}
