import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType('DeliverySenderAddressInput')
@ObjectType()
export class DeliverySenderAddress {
  @ApiProperty({ description: 'Улица', example: 'street' })
  @Field(() => String)
  street: string;

  @ApiProperty({ description: 'Номер дома', example: 'house' })
  @Field(() => String)
  house: string;

  @ApiProperty({ description: 'Номер квартиры', example: 'apartment' })
  @Field(() => String)
  apartment: string;

  @ApiProperty({ description: 'Комментарий', example: 'comment' })
  @Field(() => String, { nullable: true })
  comment?: string;
}

@InputType('DeliveryReceiverAddressInput')
@ObjectType()
export class DeliveryReceiverAddress {
  @ApiProperty({ description: 'Улица', example: 'street' })
  @Field(() => String)
  street: string;

  @ApiProperty({ description: 'Номер дома', example: 'house' })
  @Field(() => String)
  house: string;

  @ApiProperty({ description: 'Номер квартиры', example: 'apartment' })
  @Field(() => String)
  apartment: string;

  @ApiProperty({ description: 'Комментарий', example: 'comment' })
  @Field(() => String, { nullable: true })
  comment?: string;

  @ApiProperty({ description: 'Бесконтактная доставка', required: false })
  @Field(() => Boolean, { nullable: true })
  isNonContact?: boolean;
}
