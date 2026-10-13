import type { Document } from 'mongoose';

import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { BodyType, Brand, Color, Steering, Transmission } from '../../constants/enums';
import { Car } from '../../entities';

export enum CarRentStatus {
  ACTIVE = 'active',
  BOOKED = 'booked',
  CANCELLED = 'cancelled'
}
registerEnumType(CarRentStatus, {
  name: 'CarRentStatus'
});

@ObjectType()
@Schema({
  collection: 'cars/rent',
  minimize: false,
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
export class CarRent {
  @ApiProperty({ type: String, description: 'ID заказа' })
  @Field(() => String)
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Информация об автомобиле',
    example: {
      id: '12',
      name: 'Kia Rio 1.4 AT',
      brand: Brand.KIA,
      img: '/static/images/cars/kia-rio-black.webp',
      transmission: Transmission.MANUAL,
      price: 3100,
      location: 'Новосибирск, ул. Ленина, 5',
      color: Color.BLACK,
      bodyType: BodyType.SEDAN,
      steering: Steering.LEFT
    }
  })
  @Field(() => Car)
  @Prop({ required: true })
  carInfo: Car;

  @ApiProperty({
    description: 'Статус брони',
    example: CarRentStatus.BOOKED,
    enum: CarRentStatus,
    enumName: 'CarRentStatus'
  })
  @Field(() => CarRentStatus)
  @Prop({ required: true, default: CarRentStatus.BOOKED })
  status: CarRentStatus;

  @ApiProperty({ description: 'Место получения автомобиля', example: 'Москва, ул. Ленина, 1' })
  @Field(() => String)
  @Prop({ required: true })
  pickupLocation: string;

  @ApiProperty({ description: 'Место возврата автомобиля', example: 'Москва, ул. Тверская, 10' })
  @Field(() => String)
  @Prop({ required: true })
  returnLocation: string;

  @ApiProperty({
    description: 'Дата начала аренды (timestamp в миллисекундах)',
    example: 1717236000000
  })
  @Field(() => Number)
  @Prop({ required: true })
  startDate: number;

  @ApiProperty({
    description: 'Дата окончания аренды (timestamp в миллисекундах)',
    example: 1717610400000
  })
  @Field(() => Number)
  @Prop({ required: true })
  endDate: number;

  @ApiProperty({ description: 'Общая сумма аренды', example: 25000 })
  @Field(() => Number)
  @Prop({ required: true })
  totalPrice: number;

  @ApiProperty({ description: 'Имя арендатора', example: 'Иван' })
  @Field(() => String)
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({ description: 'Фамилия арендатора', example: 'Иванов' })
  @Field(() => String)
  @Prop({ required: true })
  lastName: string;

  @ApiProperty({ description: 'Отчество арендатора', example: 'Иванович', required: false })
  @Field(() => String, { nullable: true })
  @Prop()
  middleName?: string;

  @ApiProperty({ description: 'Дата рождения арендатора', example: '1990-05-10' })
  @Field(() => String)
  @Prop({ required: true })
  birthDate: string;

  @ApiProperty({ description: 'Email арендатора', example: 'ivan@example.com' })
  @Field(() => String)
  @Prop({ required: true })
  email: string;

  @ApiProperty({
    description: 'Телефон арендатора (совпадает с номером пользователя)',
    example: '79991234567'
  })
  @Field(() => String)
  @Prop({ required: true })
  phone: string;

  @ApiProperty({
    description: 'Комментарий',
    example: 'Позвонить за час до выдачи',
    required: false
  })
  @Field(() => String, { nullable: true })
  @Prop()
  comment?: string;
}

export type CarRentDocument = CarRent & Document;
export const CarRentSchema = SchemaFactory.createForClass(CarRent);
