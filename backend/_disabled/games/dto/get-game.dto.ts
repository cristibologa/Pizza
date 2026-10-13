import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class GetGameDto {
  @ApiProperty({ description: 'Slug игры' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  slug: string;
}
