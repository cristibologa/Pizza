import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

@InputType('CreatePaymentTicketsDto')
export class CreatePaymentTicketsDto {
  @ApiProperty({ description: 'Ряд', example: 1 })
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  row: number;

  @ApiProperty({ description: 'Место', example: 1 })
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  column: number;
}

@InputType('CreatePaymentDebitCardDto')
export class CreatePaymentDebitCardDto {
  @ApiProperty({ description: 'Номер карты', example: '1111 1111' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  pan: string;

  @ApiProperty({ description: 'Срок действие карты', example: '11/11' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  expireDate: string;

  @ApiProperty({ description: 'Код карты', example: '111' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  cvv: string;
}

@InputType('CreatePaymentPersonDto')
export class CreatePaymentPersonDto {
  @ApiProperty({ description: 'Имя', example: 'firstname' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ description: 'Фамилия', example: 'lastname' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ description: 'Отчество', example: 'middlename' })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  middlename?: string;

  @ApiProperty({ description: 'Телефон', example: '89990009999' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  phone: string;
}

@InputType('CreatePaymentSeanceDto')
export class CreatePaymentSeanceDto {
  @ApiProperty({ description: 'Дата сеанса', example: '29.06.23' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ description: 'Время сеанса', example: '10:00' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  time: string;
}

@ArgsType()
export class CreateCinemaPaymentDto {
  @ApiProperty({ description: 'Идентификатор фильма' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  filmId: string;

  @ApiProperty({ type: CreatePaymentPersonDto, description: 'Покупатель' })
  @Field(() => CreatePaymentPersonDto)
  @Type(() => CreatePaymentPersonDto)
  @ValidateNested()
  person: CreatePaymentPersonDto;

  @ApiProperty({ type: CreatePaymentDebitCardDto, description: 'Банковская карта' })
  @Field(() => CreatePaymentDebitCardDto)
  @Type(() => CreatePaymentDebitCardDto)
  @ValidateNested()
  debitCard: CreatePaymentDebitCardDto;

  @ApiProperty({ type: CreatePaymentSeanceDto, description: 'Сеанс фильма' })
  @Field(() => CreatePaymentSeanceDto)
  @Type(() => CreatePaymentSeanceDto)
  @ValidateNested()
  seance: CreatePaymentSeanceDto;

  @ApiProperty({ type: [CreatePaymentTicketsDto], description: 'Билеты' })
  @Field(() => [CreatePaymentTicketsDto])
  @Type(() => CreatePaymentTicketsDto)
  @ValidateNested()
  tickets: CreatePaymentTicketsDto[];
}
