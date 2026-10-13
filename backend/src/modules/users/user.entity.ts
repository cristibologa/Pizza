import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

@InputType('UserInput')
@ObjectType()
export class User {
  @ApiProperty({ type: String, description: 'ID пользователя' })
  @Field(() => String)
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Номер телефона', example: '89990009999' })
  @Field(() => String, {
    description: 'Номер телефона'
  })
  phone: string;

  @ApiProperty({ description: 'Имя', example: 'Иван', required: false })
  @Field(() => String, { description: 'Имя', nullable: true })
  firstname?: string;

  @ApiProperty({ description: 'Отчество', example: 'Иванович', required: false })
  @Field(() => String, { description: 'Отчество', nullable: true })
  middlename?: string;

  @ApiProperty({ description: 'Фамилия', example: 'Иванов', required: false })
  @Field(() => String, { description: 'Фамилия', nullable: true })
  lastname?: string;

  @ApiProperty({ description: 'Почта', example: 'example.email@gmail.com', required: false })
  @Field(() => String, { description: 'Почта', nullable: true })
  email?: string;

  @ApiProperty({ description: 'Город', example: 'Москва', required: false })
  @Field(() => String, { description: 'Город', nullable: true })
  city?: string;
}
