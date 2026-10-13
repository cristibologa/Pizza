import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '@/utils/decorators';
import { AuthorizedOnly } from '@/utils/guards';

import { User } from '../users';
import { Card } from './card.entity';
import { CardsService } from './cards.service';
import { DeleteCardDto } from './dto';
import { DeleteCardResponse, GetCardsResponse } from './responses';

@Resolver(() => Card)
export class CardsResolver {
  constructor(private readonly cardsService: CardsService) {}

  @Query(() => GetCardsResponse)
  @AuthorizedOnly()
  async getCards(@CurrentUser() user: User): Promise<GetCardsResponse> {
    return this.cardsService.getCards(user.phone);
  }

  @Mutation(() => DeleteCardResponse)
  @AuthorizedOnly()
  async deleteCard(
    @Args() deleteCardDto: DeleteCardDto,
    @CurrentUser() user: User
  ): Promise<DeleteCardResponse> {
    return this.cardsService.deleteCard(user.phone, deleteCardDto.cardId);
  }
}
