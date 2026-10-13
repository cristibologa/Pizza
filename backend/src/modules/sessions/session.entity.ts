import { Field, GraphQLISODateTime, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

@InputType('SessionInput')
@ObjectType({ description: 'Сессия' })
export class Session {
  @ApiProperty({ type: String, description: 'ID сессии' })
  @Field(() => ID, {
    description: 'ID сессии'
  })
  _id: Types.ObjectId;

  @ApiProperty({ type: Date, description: 'Дата создания сессии' })
  @Field(() => GraphQLISODateTime, {
    description: 'Дата создания сессии'
  })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Дата истечения сессии' })
  @Field(() => GraphQLISODateTime, {
    description: 'Дата истечения сессии'
  })
  expiresAt: Date;

  @ApiProperty({
    type: String,
    description: 'ID пользователя'
  })
  @Field(() => ID, {
    description: 'ID пользователя'
  })
  userId: Types.ObjectId;
}
