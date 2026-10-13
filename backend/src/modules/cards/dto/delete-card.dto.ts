import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class DeleteCardDto {
  @ApiProperty({ description: 'ID карты', example: '6875fd1f77a29189d6f4f145' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  cardId: string;
}
