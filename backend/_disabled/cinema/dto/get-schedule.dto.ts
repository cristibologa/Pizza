import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class GetScheduleDto {
  @ApiProperty({ description: 'Идентификатор фильма' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  filmId: string;
}
