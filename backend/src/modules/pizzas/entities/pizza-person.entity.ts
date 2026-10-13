import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType('PizzaPersonInput')
@ObjectType()
export class PizzaPerson {
  @ApiProperty({ description: 'Имя', example: 'firstname' })
  @Field(() => String)
  firstname: string;

  @ApiProperty({ description: 'Фамилия', example: 'lastname' })
  @Field(() => String)
  lastname: string;

  @ApiProperty({ description: 'Отчество', example: 'middlename' })
  @Field(() => String, { nullable: true })
  middlename?: string;

  @ApiProperty({ description: 'Телефон', example: '89990009999' })
  @Field(() => String)
  phone: string;
}
