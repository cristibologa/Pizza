import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OtpEntitySchema, OtpSchema } from './otp.schema';
import { OtpsController } from './otps.controller';
import { OtpsResolver } from './otps.resolver';
import { OtpsService } from './otps.service';

@Module({
  controllers: [OtpsController],
  exports: [OtpsService],
  imports: [MongooseModule.forFeature([{ name: OtpEntitySchema.name, schema: OtpSchema }])],
  providers: [OtpsService, OtpsResolver]
})
export class OtpsModule {}
