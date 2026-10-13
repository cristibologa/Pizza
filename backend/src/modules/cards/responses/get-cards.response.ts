import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '@/utils/base';

import { Card } from '../card.entity';

@ObjectType()
export class GetCardsResponse extends BaseResponse {
  @ApiProperty({ type: [Card], description: 'Список сохраненных карт пользователя' })
  @Field(() => [Card])
  cards: Card[];
}
