import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { DeliveryType } from '../constants';

@ArgsType()
export class GetRegionsDto {
  @ApiProperty({ description: 'Slug игры' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'Тип доставки',
    example: DeliveryType.STEAM_GIFT,
    enum: DeliveryType,
    enumName: 'DeliveryType'
  })
  @Field(() => DeliveryType)
  @IsNotEmpty()
  @IsString()
  deliveryType: string;
}
