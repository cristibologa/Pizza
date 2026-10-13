import { Injectable } from '@nestjs/common';

import { GameFilter, GAMES, GameType, GameView } from './constants';
import { GetGamesDto, GetPriceVariantsDto, GetRegionsDto, SearchGamesDto } from './dto';
import { DetailedGame, FilteredGame, GamesPaginationMeta } from './entities';

interface GetPaginationParams<Item> {
  items: Item[];
  limit?: number;
  page?: number;
}

interface PaginationResult<Item> {
  games: Item[];
  meta: GamesPaginationMeta;
}

const THREE_YEARS_IN_MS = 3 * 365.25 * 24 * 3600 * 1000;

@Injectable()
export class GamesService {
  getGames() {
    return GAMES;
  }

  findGame(slug: string) {
    return this.getGames().find((game) => game.slug === slug);
  }

  getGame(slug: string): DetailedGame {
    const game = this.findGame(slug);

    if (!game) return undefined;

    const deliveryTypes = [...new Set(game.priceVariants.map((variant) => variant.deliveryType))];

    return {
      deliveryTypes,
      description: game.description,
      genres: game.genres,
      image: game.image,
      developer: game.developer,
      externalId: game.externalId,
      minimumSystemRequirements: game.minimumSystemRequirements,
      name: game.name,
      publisher: game.publisher,
      recommendedSystemRequirements: game.recommendedSystemRequirements,
      releaseDate: game.releaseDate,
      screenshots: game.screenshots,
      slug: game.slug,
      type: game.type
    };
  }

  getFilteredGames(dto: GetGamesDto): FilteredGame[] {
    const filteredGames = this.getGames().filter((game) => {
      if (dto.filter?.length) {
        if (
          dto.filter.includes(GameFilter.DISCOUNT) &&
          !game.priceVariants.some((variant) => variant.oldPrice)
        )
          return false;

        if (dto.filter.includes(GameFilter.DLC) && game.type !== GameType.DLC) return false;
      }

      if (dto.view) {
        if (dto.view === GameView.POPULAR && !game.isPopular) return false;

        if (dto.view === GameView.NEW && game.releaseDate < (Date.now() - THREE_YEARS_IN_MS) / 1000)
          return false;
      }

      if (dto.genre?.length && !dto.genre.some((genre) => game.genres.includes(genre)))
        return false;

      return true;
    });

    return filteredGames.map((game) => {
      let priceVariants = game.priceVariants;

      if (dto.filter?.includes(GameFilter.DISCOUNT)) {
        priceVariants = game.priceVariants.filter((v) => v.oldPrice);
      }

      const priceVariant = priceVariants.reduce((min, current) => {
        if (dto.filter?.includes(GameFilter.DISCOUNT)) {
          if (current.oldPrice && !min.oldPrice) return current;
          if (!current.oldPrice && min.oldPrice) return min;
        }
        return current.price < min.price ? current : min;
      }, priceVariants[0]);
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

  searchAutocomplete(searchGamesDto: SearchGamesDto): FilteredGame[] {
    const normalizedSearch = searchGamesDto.search.toLowerCase().trim();
    const limit = searchGamesDto.limit ?? 8;

    if (!normalizedSearch) return [];

    return this.getGames()
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
  }

  getRegions(dto: GetRegionsDto) {
    const game = this.findGame(dto.slug);

    if (!game) return undefined;

    return game.priceVariants
      .filter((variant) => variant.deliveryType === dto.deliveryType)
      .map((variant) => variant.region);
  }

  getPriceVariant(dto: GetPriceVariantsDto) {
    const game = this.findGame(dto.slug);

    if (!game) return undefined;
    return game.priceVariants.filter(
      (variant) => variant.deliveryType === dto.deliveryType && variant.region === dto.region
    );
  }

  getPagination<Item>({
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
