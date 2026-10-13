import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

@InputType('CalculateDeliveryPointDto')
export class CalculateDeliveryPointDto {
  @ApiProperty({ description: 'Широта', example: 56.8389 })
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Долгота', example: 60.6057 })
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}

@InputType('CalculateDeliveryPackageDto')
export class CalculateDeliveryPackageDto {
  @ApiProperty({ description: 'Длина посылки', example: 10 })
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  length: number;

  @ApiProperty({ description: 'Ширина посылки', example: 10 })
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  width: number;

  @ApiProperty({ description: 'Длина посылки', example: 10 })
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty({ description: 'Высота посылки', example: 10 })
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  height: number;
}

@ArgsType()
export class CalculateDeliveryDto {
  @ApiProperty({ type: CalculateDeliveryPackageDto, description: 'Поссылка' })
  @Field(() => CalculateDeliveryPackageDto)
  @Type(() => CalculateDeliveryPackageDto)
  @ValidateNested()
  package: CalculateDeliveryPackageDto;

  @ApiProperty({ type: CalculateDeliveryPointDto, description: 'Город отправки' })
  @Field(() => CalculateDeliveryPointDto)
  @Type(() => CalculateDeliveryPointDto)
  @ValidateNested()
  senderPoint: CalculateDeliveryPointDto;

  @ApiProperty({ type: CalculateDeliveryPointDto, description: 'Город получения' })
  @Field(() => CalculateDeliveryPointDto)
  @Type(() => CalculateDeliveryPointDto)
  @ValidateNested()
  receiverPoint: CalculateDeliveryPointDto;
}
