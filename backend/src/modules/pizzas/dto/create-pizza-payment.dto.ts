import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

import { PizzaOrderedItem } from '../entities';

@InputType('CreatePizzaPaymentPersonDto')
export class CreatePizzaPaymentPersonDto {
  @ApiProperty({ description: 'Телефон', example: '89990009999' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  phone: string;
}

@InputType('CreatePizzaPaymentAddressDto')
export class CreatePizzaPaymentAddressDto {
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

@InputType()
export class CreatePizzaPaymentDto {
  @ApiProperty({ type: CreatePizzaPaymentAddressDto, description: 'Адрес доставки' })
  @Field(() => CreatePizzaPaymentAddressDto)
  @Type(() => CreatePizzaPaymentAddressDto)
  @ValidateNested()
  receiverAddress: CreatePizzaPaymentAddressDto;

  @ApiProperty({ type: CreatePizzaPaymentPersonDto, description: 'Данные пользователя' })
  @Field(() => CreatePizzaPaymentPersonDto)
  @Type(() => CreatePizzaPaymentPersonDto)
  @ValidateNested()
  person: CreatePizzaPaymentPersonDto;

  @ApiProperty({ type: [PizzaOrderedItem], description: 'Позиции корзины' })
  @Field(() => [PizzaOrderedItem])
  @Type(() => PizzaOrderedItem)
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  items: PizzaOrderedItem[];
}
