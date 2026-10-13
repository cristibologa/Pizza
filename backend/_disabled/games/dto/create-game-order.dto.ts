import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { DeliveryType, Region } from '../constants';

@InputType('CreateGameOrderPersonDto')
export class CreateGameOrderPersonDto {
  @ApiProperty({ description: 'Телефон пользователя', example: '79990001122' })
  @Field(() => String)
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Email пользователя', example: 'example@mail.com' })
  @Field(() => String)
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Ссылка на приглашение',
    example: 'https://s.team/p/',
    required: false
  })
  @Field(() => String, { nullable: true })
  @IsOptional()
  inviteLink?: string;
}

@ArgsType()
export class CreateGameOrderDto {
  @ApiProperty({ description: 'Slug игры', example: 'battlefield-2042' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  gameSlug: string;

  @ApiProperty({
    description: 'Тип доставки',
    example: DeliveryType.STEAM_GIFT,
    enum: DeliveryType,
    enumName: 'DeliveryType'
  })
  @Field(() => DeliveryType)
  @IsNotEmpty()
  @IsString()
  deliveryType: DeliveryType;

  @ApiProperty({ description: 'Регион', example: Region.RU, enum: Region, enumName: 'Region' })
  @Field(() => Region)
  @IsNotEmpty()
  @IsString()
  region: Region;

  @ApiProperty({ description: 'Издание', example: 'Deluxe' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  edition: string;

  @ApiProperty({ type: CreateGameOrderPersonDto, description: 'Данные покупателя' })
  @Field(() => CreateGameOrderPersonDto)
  @Type(() => CreateGameOrderPersonDto)
  @ValidateNested()
  person: CreateGameOrderPersonDto;

  @ApiProperty({ description: 'Дебетовая карта для оплаты', example: '2202 2063 8908 5954' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  debitCard: string;
}
