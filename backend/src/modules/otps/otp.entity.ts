import { Field, GraphQLISODateTime, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

@InputType('OtpInput')
@ObjectType()
export class Otp {
  @ApiProperty({ type: String, description: 'ID OTP кода' })
  @Field(() => String, {
    description: 'ID OTP кода'
  })
  _id: Types.ObjectId;

  @ApiProperty({ type: Date, description: 'Дата создания OTP кода' })
  @Field(() => GraphQLISODateTime, {
    description: 'Дата создания OTP кода'
  })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Дата истечения OTP кода' })
  @Field(() => GraphQLISODateTime, {
    description: 'Дата истечения OTP кода'
  })
  expiresAt: Date;

  @ApiProperty({ description: 'Задержка до повторной отправки OTP кода' })
  @Field(() => Number, {
    description: 'Задержка до повторной отправки OTP кода'
  })
  retryDelay: number;

  @ApiProperty({ description: 'Номер телефона' })
  @Field(() => String, {
    description: 'Номер телефона'
  })
  phone: string;

  @ApiProperty({ description: 'OTP код' })
  @Field(() => Number, {
    description: 'OTP код'
  })
  code: number;
}
