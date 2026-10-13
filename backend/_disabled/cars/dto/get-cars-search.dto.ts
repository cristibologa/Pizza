import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Validate } from 'class-validator';

import { transformSearchParam } from '@/utils/helpers';

import { BodyType, Brand, Color, Steering, Transmission } from '../constants/enums';
import { TimestampValidator } from './create-rent.dto';

@ArgsType()
export class GetCarsSearchDto {
  @Field(() => Number, {
    description: 'Дата начала аренды (timestamp в миллисекундах)',
    nullable: true
  })
  @IsNumber()
  @IsOptional()
  @Validate(TimestampValidator)
  startDate?: number;

  @Field(() => Number, {
    description: 'Дата окончания аренды (timestamp в миллисекундах)',
    nullable: true
  })
  @IsNumber()
  @IsOptional()
  @Validate(TimestampValidator)
  endDate?: number;

  @ApiProperty({
    description: 'Фильтр по бренду автомобиля',
    example: [Brand.HYUNDAI, Brand.KIA],
    enum: Brand,
    isArray: true,
    required: false,
    enumName: 'Brand'
  })
  @Field(() => [Brand], { nullable: true })
  @Transform(transformSearchParam)
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  brand?: Brand[];

  @ApiProperty({
    description: 'Фильтр по типу кузова',
    example: [BodyType.SEDAN, BodyType.SUV],
    enum: BodyType,
    isArray: true,
    required: false,
    enumName: 'BodyType'
  })
  @Field(() => [BodyType], { nullable: true })
  @Transform(transformSearchParam)
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  bodyType?: BodyType[];

  @ApiProperty({
    description: 'Фильтр по цвету автомобиля',
    example: [Color.BLACK, Color.WHITE],
    enum: Color,
    isArray: true,
    required: false,
    enumName: 'Color'
  })
  @Field(() => [Color], { nullable: true })
  @Transform(transformSearchParam)
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  color?: Color[];

  @ApiProperty({
    description: 'Фильтр по типу рулевого управления',
    example: [Steering.LEFT, Steering.RIGHT],
    enum: Steering,
    isArray: true,
    required: false,
    enumName: 'Steering'
  })
  @Field(() => [Steering], { nullable: true })
  @Transform(transformSearchParam)
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  steering?: Steering[];

  @ApiProperty({
    description: 'Фильтр по типу коробки передач',
    example: [Transmission.AUTOMATIC, Transmission.MANUAL],
    enum: Transmission,
    isArray: true,
    required: false,
    enumName: 'Transmission'
  })
  @Field(() => [Transmission], { nullable: true })
  @Transform(transformSearchParam)
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  transmission?: Transmission[];

  @Field(() => Number, { nullable: true })
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @Field(() => Number, { nullable: true })
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @Field(() => Number, { nullable: true })
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  page?: number;

  @Field(() => Number, { nullable: true })
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
