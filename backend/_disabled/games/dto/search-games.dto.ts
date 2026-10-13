import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class SearchGamesDto {
  @ApiProperty({ description: 'Строка поиска для автокомплита' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  search: string;

  @ApiProperty({ description: 'Лимит результатов', example: 8, required: false })
  @Field(() => Number, { nullable: true })
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  limit?: number;
}
