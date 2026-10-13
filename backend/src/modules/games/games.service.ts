import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TransactionOrderType, TransactionsService } from '@/modules/transactions';
import { UsersService } from '@/modules/users';
import { BaseService } from '@/utils/base';
import { Result } from '@/utils/helpers';

import { GameDeliveryType, GameFilter, GameType, GameView } from './constants';
import {
  CreateGameOrderDto,
  GetGameDto,
  GetGamePaidOrderDto,
  GetGamePriceVariantsDto,
  GetGameRegionsDto,
  GetGamesSearchDto,
  SearchGamesDto
} from './dto';
import { GameDetailed, GameFiltered, GamePaginationMeta, GamePriceVariant } from './game.entity';
import { GameEntitySchema } from './game.schema';
import { GameOrderService, GameOrderStatus } from './modules';

interface GetPaginationParams<Item> {
  items: Item[];
  limit?: number;
  page?: number;
}

interface PaginationResult<Item> {
  games: Item[];
  meta: GamePaginationMeta;
  [key: string]: unknown;
}

const THREE_YEARS_IN_MS = 3 * 365.25 * 24 * 3600 * 1000;

const CURRENCY = 'RUB';

@Injectable()
export class GamesService extends BaseService<GameEntitySchema> {
  constructor(
    @InjectModel(GameEntitySchema.name) private readonly gameModel: Model<GameEntitySchema>,
    private readonly gameOrderService: GameOrderService,
    private readonly usersService: UsersService,
    private readonly transactionsService: TransactionsService
  ) {
    super(gameModel);
  }

  private async findGames() {
    return this.findMany();
  }

  async findGame(slug: string) {
    return this.findOne({ slug });
  }

  private getGameDeliveryTypes(priceVariants: GamePriceVariant[]) {
    return [...new Set(priceVariants.map((variant) => variant.deliveryType))];
  }

  async getGames(getGamesDto: GetGamesSearchDto) {
    const games = await this.getFilteredGames(getGamesDto);
    const paginatedGames = this.getPagination({
      items: games,
      page: getGamesDto.page,
      limit: getGamesDto.limit
    });

    return Result.success(paginatedGames);
  }

  async getGame(getGameDto: GetGameDto) {
    const game = await this.findGame(getGameDto.slug);

    if (!game) {
      throw new NotFoundException(Result.fail('Игра не найдена'));
    }

    return Result.success({
      game: {
        ...game,
        deliveryTypes: this.getGameDeliveryTypes(game.priceVariants)
      } as GameDetailed
    });
  }

  private async getFilteredGames(getGamesDto: GetGamesSearchDto): Promise<GameFiltered[]> {
    const games = await this.findGames();

    const filteredGames = games.filter((game) => {
      if (getGamesDto.filter?.length) {
        if (
          getGamesDto.filter.includes(GameFilter.DISCOUNT) &&
          !game.priceVariants.some((variant) => variant.oldPrice)
        )
          return false;

        if (getGamesDto.filter.includes(GameFilter.DLC) && game.type !== GameType.DLC) return false;
      }

      if (getGamesDto.view) {
        if (getGamesDto.view === GameView.POPULAR && !game.isPopular) return false;

        if (
          getGamesDto.view === GameView.NEW &&
          game.releaseDate < (Date.now() - THREE_YEARS_IN_MS) / 1000
        )
          return false;
      }

      if (
        getGamesDto.genre?.length &&
        !getGamesDto.genre.some((genre) => game.genres.includes(genre))
      )
        return false;

      return true;
    });

    return filteredGames.map((game) => {
      const priceVariant = game.priceVariants.reduce((min, current) => {
        if (current.oldPrice && !min.oldPrice) return current;
        if (!current.oldPrice && min.oldPrice) return min;

        return current.price < min.price ? current : min;
      }, game.priceVariants[0]);

      return {
        priceVariant,
        image: game.image,
        name: game.name,
        slug: game.slug,
        type: game.type,
        genres: game.genres,
        releaseDate: game.releaseDate
      };
    });
  }

  async searchGames(searchGamesDto: SearchGamesDto) {
    const normalizedSearch = searchGamesDto.search.toLowerCase().trim();
    const limit = searchGamesDto.limit ?? 8;

    if (!normalizedSearch) return Result.success({ games: [] });

    const games = await this.findGames();

    const filteredGames = games
      .filter(
        (game) =>
          game.name.toLowerCase().includes(normalizedSearch) ||
          game.description.toLowerCase().includes(normalizedSearch)
      )
      .slice(0, limit)
      .map((game) => {
        const priceVariant = game.priceVariants.reduce(
          (min, current) => (current.price < min.price ? current : min),
          game.priceVariants[0]
        );
        return {
          priceVariant,
          image: game.image,
          name: game.name,
          slug: game.slug,
          type: game.type,
          genres: game.genres,
          releaseDate: game.releaseDate
        };
      })
      .sort((a, b) => {
        const aStartsWithName = a.name.toLowerCase().startsWith(normalizedSearch);
        const bStartsWithName = b.name.toLowerCase().startsWith(normalizedSearch);

        if (aStartsWithName !== bStartsWithName) {
          return aStartsWithName ? -1 : 1;
        }

        return a.name.localeCompare(b.name);
      });

    return Result.success({ games: filteredGames });
  }

  async getGameRegions(getGameRegionsDto: GetGameRegionsDto) {
    const game = await this.findGame(getGameRegionsDto.slug);

    if (!game) {
      throw new NotFoundException(Result.fail('Регионы не найдены'));
    }

    const regions = game.priceVariants
      .filter((variant) => variant.deliveryType === getGameRegionsDto.deliveryType)
      .map((variant) => variant.region);

    return Result.success({ regions });
  }

  async getGamePriceVariants(getGamePriceVariantsDto: GetGamePriceVariantsDto) {
    const game = await this.findGame(getGamePriceVariantsDto.slug);

    if (!game) {
      throw new NotFoundException(Result.fail('Варианты не найдены'));
    }

    const priceVariants = game.priceVariants.filter(
      (variant) =>
        variant.deliveryType === getGamePriceVariantsDto.deliveryType &&
        variant.region === getGamePriceVariantsDto.region
    );

    return Result.success({ priceVariants });
  }

  async createGameOrder(createGameOrderDto: CreateGameOrderDto) {
    const game = await this.findGame(createGameOrderDto.gameSlug);

    if (!game) {
      throw new NotFoundException(Result.fail('Игра не найдена'));
    }

    const priceVariant = game.priceVariants.find(
      (variant) =>
        createGameOrderDto.deliveryType === variant.deliveryType &&
        createGameOrderDto.edition === variant.edition &&
        createGameOrderDto.region === variant.region
    );

    if (!priceVariant) {
      throw new NotFoundException(Result.fail('Вариант цены не найден'));
    }

    if (
      priceVariant.deliveryType === GameDeliveryType.STEAM_GIFT &&
      !createGameOrderDto.person.inviteLink
    ) {
      throw new BadRequestException(
        Result.fail('При заказе Steam Gift необходимо указать ссылку приглашения')
      );
    }

    const user = await this.usersService.findOrCreateUser(createGameOrderDto.person.phone);

    await this.usersService.updateOne(
      { phone: user.phone },
      { email: createGameOrderDto.person.email }
    );

    const order = await this.gameOrderService.create({
      person: createGameOrderDto.person,
      gameSlug: game.slug,
      gameName: game.name,
      gameImage: game.image,
      deliveryType: priceVariant.deliveryType,
      edition: priceVariant.edition,
      price: priceVariant.price,
      region: priceVariant.region,
      status: GameOrderStatus.AWAITING_PAYMENT,
      gameKey: null,
      transactionId: null
    });

    const transaction = await this.transactionsService.createTransaction({
      phone: createGameOrderDto.person.phone,
      orderId: String(order._id),
      orderType: TransactionOrderType.GAME,
      amount: priceVariant.price,
      currency: CURRENCY
    });

    const updatedOrder = await this.gameOrderService.updateById(String(order._id), {
      transactionId: String(transaction._id)
    });

    if (!updatedOrder) {
      throw new BadRequestException(Result.fail(`Заказ ${order._id} не найден`));
    }

    return Result.success({
      order: updatedOrder,
      transaction
    });
  }

  async getGameOrders(phone: string) {
    const orders = await this.gameOrderService.findUserPaidOrders(phone);

    return Result.success({ orders });
  }

  async getGameOrder(orderId: string, phone: string) {
    const order = await this.gameOrderService.findById(orderId);

    if (
      !order ||
      order.person.phone !== phone ||
      order.status === GameOrderStatus.AWAITING_PAYMENT
    ) {
      throw new NotFoundException(Result.fail('Заказ не найден'));
    }

    return Result.success({ order });
  }

  async getGamePaidOrder({ token }: GetGamePaidOrderDto) {
    const transaction = await this.transactionsService.consumeOrderAccessToken(
      token,
      TransactionOrderType.GAME
    );

    const order = await this.gameOrderService.findById(transaction.orderId);

    if (!order || order.status === GameOrderStatus.AWAITING_PAYMENT) {
      throw new NotFoundException(Result.fail('Заказ не найден'));
    }

    return Result.success({ order });
  }

  private getPagination<Item>({
    items,
    page = 1,
    limit = 10
  }: GetPaginationParams<Item>): PaginationResult<Item> {
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const games = items.slice(startIndex, endIndex);

    return {
      games,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }
}
