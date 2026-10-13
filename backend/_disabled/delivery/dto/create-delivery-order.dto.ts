import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

import { DeliveryOptionType } from '../entities';
import { Payer } from '../modules';

@InputType('CreateDeliveryOrderPersonDto')
export class CreateDeliveryOrderPersonDto {
  @ApiProperty({ description: 'Имя', example: 'firstname' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ description: 'Фамилия', example: 'lastname' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ description: 'Отчество', example: 'middlename', required: false })
  @Field(() => String, { nullable: true })
  middlename?: string;

  @ApiProperty({ description: 'Телефон', example: '89990009999' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  phone: string;
}

@InputType('CreateDeliveryOrderSenderAddressDto')
export class CreateDeliveryOrderSenderAddressDto {
  @ApiProperty({ description: 'Улица', example: 'street' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ description: 'Номер дома', example: 'house' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  house: string;

  @ApiProperty({ description: 'Номер квартиры', example: 'apartment' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  apartment: string;

  @ApiProperty({ description: 'Комментарий', example: 'comment', required: false })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;
}

@InputType('CreateDeliveryOrderReceiverAddressDto')
export class CreateDeliveryOrderReceiverAddressDto {
  @ApiProperty({ description: 'Улица', example: 'street' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ description: 'Номер дома', example: 'house' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  house: string;

  @ApiProperty({ description: 'Номер квартиры', example: 'apartment' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  apartment: string;

  @ApiProperty({ description: 'Комментарий', example: 'comment', required: false })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ description: 'Бесконтактная доставка', required: false })
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isNonContact?: boolean;
}

@ArgsType()
export class CreateDeliveryOrderDto {
  @ApiProperty({ description: 'Идентификатор типа посылки' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  packageId: string;

  @ApiProperty({
    description: 'Тип заказа',
    example: DeliveryOptionType.DEFAULT,
    enum: DeliveryOptionType,
    enumName: 'DeliveryOptionType'
  })
  @Field(() => DeliveryOptionType)
  @IsEnum(DeliveryOptionType)
  @IsNotEmpty()
  optionType: DeliveryOptionType;

  @ApiProperty({ description: 'Идентификатор города отправки' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  senderPointId: string;

  @ApiProperty({ type: CreateDeliveryOrderSenderAddressDto, description: 'Адрес отправителя' })
  @Field(() => CreateDeliveryOrderSenderAddressDto)
  @Type(() => CreateDeliveryOrderSenderAddressDto)
  @ValidateNested()
  senderAddress: CreateDeliveryOrderSenderAddressDto;

  @ApiProperty({ type: CreateDeliveryOrderPersonDto, description: 'Отправитель' })
  @Field(() => CreateDeliveryOrderPersonDto)
  @Type(() => CreateDeliveryOrderPersonDto)
  @ValidateNested()
  sender: CreateDeliveryOrderPersonDto;

  @ApiProperty({ description: 'Идентификатор города получения' })
  @Field(() => String)
  @IsString()
  receiverPointId: string;

  @ApiProperty({ type: CreateDeliveryOrderReceiverAddressDto, description: 'Адрес получателя' })
  @Field(() => CreateDeliveryOrderReceiverAddressDto)
  @Type(() => CreateDeliveryOrderReceiverAddressDto)
  @ValidateNested()
  receiverAddress: CreateDeliveryOrderReceiverAddressDto;

  @ApiProperty({ type: CreateDeliveryOrderPersonDto, description: 'Получатель' })
  @Field(() => CreateDeliveryOrderPersonDto)
  @Type(() => CreateDeliveryOrderPersonDto)
  @ValidateNested()
  receiver: CreateDeliveryOrderPersonDto;

  @ApiProperty({
    description: 'Кто будет оплачивать',
    example: Payer.SENDER,
    enum: Payer,
    enumName: 'Payer'
  })
  @Field(() => Payer)
  @IsEnum(Payer)
  payer: Payer;
}
