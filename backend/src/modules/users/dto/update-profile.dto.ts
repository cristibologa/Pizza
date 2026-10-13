import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class UpdateProfileDto {
  @ApiProperty({ description: 'Имя', example: 'Иван', required: false })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiProperty({ description: 'Отчество', example: 'Иванович', required: false })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  middlename?: string;

  @ApiProperty({ description: 'Фамилия', example: 'Иванов', required: false })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiProperty({ description: 'Почта', example: 'example.email@gmail.com', required: false })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Город', example: 'Москва', required: false })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  city?: string;
}
