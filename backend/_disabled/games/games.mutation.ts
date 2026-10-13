import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UsersService } from '@/modules/users';
import { BaseResolver } from '@/utils/services';

import { DeliveryType } from './constants';
import { CreateGameOrderDto } from './dto';
import { CreateGameOrderResponse } from './games.model';
import { GamesService } from './games.service';
import { GameOrderService } from './modules';

@Resolver('🎮 games mutation')
@Resolver()
export class GamesMutation extends BaseResolver {
  constructor(
    private readonly gamesService: GamesService,
    private readonly gameOrderService: GameOrderService,
    private readonly usersService: UsersService
  ) {
    super();
  }

  @Mutation(() => CreateGameOrderResponse)
  async createGameOrder(
    @Args('input') createGameOrderDto: CreateGameOrderDto
  ): Promise<CreateGameOrderResponse> {
    const game = this.gamesService.findGame(createGameOrderDto.gameSlug);

    if (!game) {
      throw new NotFoundException(this.wrapFail('Игра не найдена'));
    }

    let user = await this.usersService.findOne({ phone: createGameOrderDto.person.phone });

    if (!user) {
      user = await this.usersService.create({
        phone: createGameOrderDto.person.phone
      });
    }

    await this.usersService.findOneAndUpdate(
      { phone: user.phone },
      {
        $set: {
          email: createGameOrderDto.person.email
        }
      }
    );

    const priceVariant = game.priceVariants.find(
      (variant) =>
        createGameOrderDto.deliveryType === variant.deliveryType &&
        createGameOrderDto.edition === variant.edition &&
        createGameOrderDto.region === variant.region
    );

    if (
      priceVariant?.deliveryType === DeliveryType.STEAM_GIFT &&
      !createGameOrderDto.person.inviteLink
    ) {
      throw new BadRequestException(
        this.wrapFail('При заказе Steam Gift необходимо указать ссылку приглашения')
      );
    }

    if (!priceVariant) {
      throw new NotFoundException(this.wrapFail('Вариант цены не найден'));
    }

    const order = await this.gameOrderService.create({
      person: createGameOrderDto.person,
      gameSnapshot: {
        deliveryType: priceVariant.deliveryType,
        edition: priceVariant.edition,
        price: priceVariant.price,
        region: priceVariant.region,
        slug: game.slug,
        name: game.name,
        image: game.image
      },
      ...(priceVariant.deliveryType !== DeliveryType.STEAM_GIFT && {
        gameKey: this.gameOrderService.generateGameKey()
      })
    });

    return this.wrapSuccess({ order });
  }
}
