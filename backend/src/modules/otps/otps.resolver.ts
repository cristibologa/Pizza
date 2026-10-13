import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CreateOtpDto } from './dto';
import { Otp } from './otp.entity';
import { OtpsService } from './otps.service';
import { CreateOtpResponse } from './responses';

@Resolver(() => Otp)
export class OtpsResolver {
  constructor(private readonly otpsService: OtpsService) {}

  @Mutation(() => CreateOtpResponse)
  async createOtp(@Args() сreateOtpDto: CreateOtpDto): Promise<CreateOtpResponse> {
    return this.otpsService.createOtp(сreateOtpDto);
  }
}
