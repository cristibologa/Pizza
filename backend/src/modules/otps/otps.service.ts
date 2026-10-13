import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseService } from '@/utils/base';
import { Result } from '@/utils/helpers';

import { CreateOtpDto } from './dto';
import { OtpEntitySchema } from './otp.schema';
import { OTP_EXPIRED_TIME, RETRY_DELAY } from './otps.constants';
import { CreateOtpResponse } from './responses';

@Injectable()
export class OtpsService extends BaseService<OtpEntitySchema> {
  constructor(@InjectModel(OtpEntitySchema.name) private otpModel: Model<OtpEntitySchema>) {
    super(otpModel);
  }

  async createOtp({ phone }: CreateOtpDto): Promise<CreateOtpResponse> {
    const existingOtp = await this.findOne({ phone });

    if (existingOtp) {
      const { retryDelay, createdAt } = existingOtp;
      const now = Date.now();

      if (new Date(createdAt).getTime() + retryDelay > now) {
        return Result.success({
          retryDelay: RETRY_DELAY - (now - new Date(createdAt).getTime())
        });
      }

      await this.deleteOne({ phone });
    }

    const code = Math.floor(100000 + Math.random() * 900000);

    await this.create({
      phone,
      code,
      retryDelay: RETRY_DELAY,
      expiresAt: new Date(Date.now() + OTP_EXPIRED_TIME)
    });

    return Result.success({ retryDelay: RETRY_DELAY });
  }
}
