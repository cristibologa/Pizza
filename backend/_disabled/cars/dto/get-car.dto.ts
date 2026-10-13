import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class GetCarDto {
  @ApiProperty({ description: 'Идентификатор автомобиля' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  carId: string;
}
