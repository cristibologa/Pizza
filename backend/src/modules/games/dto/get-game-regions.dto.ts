import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { GameDeliveryType } from '../constants';

@ArgsType()
export class GetGameRegionsDto {
  @ApiProperty({ description: 'Slug игры' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'Тип доставки',
    example: GameDeliveryType.STEAM_GIFT,
    enum: GameDeliveryType,
    enumName: 'GameDeliveryType'
  })
  @Field(() => GameDeliveryType)
  @IsNotEmpty()
  @IsString()
  deliveryType: string;
}
