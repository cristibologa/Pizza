import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ async: false, name: 'timestamp' })
export class TimestampValidator implements ValidatorConstraintInterface {
  public validate(value: number, _arguments: ValidationArguments): boolean {
    if (typeof value !== 'number') return false;

    if (value.toString().length !== 13) return false;

    const date = new Date(value);
    return !Number.isNaN(date.getTime());
  }

  public defaultMessage(_arguments: ValidationArguments): string {
    return 'Дата должна быть передана в формате timestamp (миллисекунды)';
  }
}

@ArgsType()
export class CreateRentDto {
  @ApiProperty({ description: 'Идентификатор автомобиля', example: 'car123' })
  @Field(() => String)
  @IsString()
  carId: string;

  @ApiProperty({ description: 'Место получения автомобиля', example: 'Москва, ул. Ленина, 12' })
  @Field(() => String)
  @IsString()
  pickupLocation: string;

  @ApiProperty({ description: 'Место возврата автомобиля', example: 'Москва, ул. Тверская, 15' })
  @Field(() => String)
  @IsString()
  returnLocation: string;

  @ApiProperty({
    description: 'Дата начала аренды (timestamp в миллисекундах)',
    example: 1717236000000
  })
  @Field(() => Number)
  @IsNumber()
  @Validate(TimestampValidator)
  startDate: number;

  @ApiProperty({
    description: 'Дата окончания аренды (timestamp в миллисекундах)',
    example: 1717610400000
  })
  @Field(() => Number)
  @IsNumber()
  @Validate(TimestampValidator)
  endDate: number;

  @ApiProperty({ description: 'Имя арендатора', example: 'Иван' })
  @Field(() => String)
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Фамилия арендатора', example: 'Иванов' })
  @Field(() => String)
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Отчество арендатора', example: 'Иванович', required: false })
  @Field(() => String)
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ description: 'Дата рождения арендатора (ISO формат)', example: '1990-01-01' })
  @Field(() => String)
  @IsDateString()
  birthDate: string;

  @ApiProperty({ description: 'Email арендатора', example: 'ivan@example.com' })
  @Field(() => String)
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Телефон арендатора в формате 7XXXXXXXXXX', example: '79876543210' })
  @Field(() => String)
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Комментарий арендатора',
    example: 'Позвонить за 1 час до выдачи',
    required: false
  })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;
}
