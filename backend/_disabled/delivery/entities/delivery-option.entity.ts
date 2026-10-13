import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

export enum DeliveryOptionType {
  DEFAULT = 'default',
  EXPRESS = 'express'
}
registerEnumType(DeliveryOptionType, {
  name: 'DeliveryOptionType'
});

@InputType('DeliveryOpttionInput')
@ObjectType()
export class DeliveryOption {
  @ApiProperty({ description: 'Индентификатор опции доставки', example: '1' })
  @Field(() => String)
  id: string;

  @ApiProperty({ description: 'Цена доставки в копейках', example: 10000 })
  @Field(() => Number)
  price: number;

  @ApiProperty({ description: 'Количество дней доставки', example: 2 })
  @Field(() => Number)
  days: number;

  @ApiProperty({ description: 'Название опции отправки', example: 'name' })
  @Field(() => String)
  name: string;

  @ApiProperty({
    description: 'Тип доставки',
    example: DeliveryOptionType.DEFAULT,
    enum: DeliveryOptionType,
    enumName: 'DeliveryOptionType'
  })
  @Field(() => DeliveryOptionType)
  type: DeliveryOptionType;
}
