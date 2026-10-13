import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { GameDeliveryType, GameRegion } from '../constants';

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

@InputType()
export class CreateGameOrderDto {
  @ApiProperty({ description: 'Slug игры', example: 'battlefield-2042' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  gameSlug: string;

  @ApiProperty({
    description: 'Тип доставки',
    example: GameDeliveryType.STEAM_GIFT,
    enum: GameDeliveryType,
    enumName: 'GameDeliveryType'
  })
  @Field(() => GameDeliveryType)
  @IsNotEmpty()
  @IsString()
  deliveryType: GameDeliveryType;

  @ApiProperty({
    description: 'Регион',
    example: GameRegion.RU,
    enum: GameRegion,
    enumName: 'GameRegion'
  })
  @Field(() => GameRegion)
  @IsNotEmpty()
  @IsString()
  region: GameRegion;

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
}
