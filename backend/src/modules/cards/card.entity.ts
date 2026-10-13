import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

@InputType('CardInput')
@ObjectType()
export class Card {
  @ApiProperty({ type: String, description: 'ID карты' })
  @Field(() => ID)
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Телефон владельца карты', example: '89990009999' })
  @Field(() => String)
  phone: string;

  @ApiProperty({ description: 'Замаскированный номер карты', example: '1234' })
  @Field(() => String)
  panMasked: string;

  @ApiProperty({ description: 'Срок действия карты', example: '12/28' })
  @Field(() => String)
  expiry: string;

  @ApiProperty({
    description: 'Крипто-пакет карты в base64',
    nullable: true,
    required: false
  })
  @Field(() => String)
  cryptoPacket: string;
}
