import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType('DeliveryPackageTypeInput')
@ObjectType()
export class DeliveryPackageType {
  @ApiProperty({ description: 'Индентификатор типа посылки', example: 'envelope' })
  @Field(() => String)
  id: string;

  @ApiProperty({ description: 'Название типа посылки', example: 'name' })
  @Field(() => String)
  name: string;

  @ApiProperty({ description: 'Длина посылки', example: 'length' })
  @Field(() => Number)
  length: number;

  @ApiProperty({ description: 'Ширина посылки', example: 'width' })
  @Field(() => Number)
  width: number;

  @ApiProperty({ description: 'Длина посылки', example: 'weight' })
  @Field(() => Number)
  weight: number;

  @ApiProperty({ description: 'Высота посылки', example: 'length' })
  @Field(() => Number)
  height: number;
}
