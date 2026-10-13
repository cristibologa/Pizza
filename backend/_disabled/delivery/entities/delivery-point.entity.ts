import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType('DeliveryPointInput')
@ObjectType()
export class DeliveryPoint {
  @ApiProperty({ description: 'Индентификатор пункта', example: '1' })
  @Field(() => String)
  id: string;

  @ApiProperty({ description: 'Название пункта', example: 'name' })
  @Field(() => String)
  name: string;

  @ApiProperty({ description: 'Широта', example: 'latitude' })
  @Field(() => Number)
  latitude: number;

  @ApiProperty({ description: 'Долгота', example: 'longitude' })
  @Field(() => Number)
  longitude: number;
}
