import { registerEnumType } from '@nestjs/graphql';

export enum GameGenre {
  ACTION = 'action',
  ADVENTURE = 'adventure',
  RPG = 'rpg',
  STRATEGY = 'strategy',
  SHOOTER = 'shooter',
  SIMULATION = 'simulation',
  SURVIVAL = 'survival',
  SPORTS = 'sports',
  RACING = 'racing',
  INDIE = 'indie',
  HORROR = 'horror'
}

registerEnumType(GameGenre, {
  name: 'GameGenre'
});

export enum GameDeliveryType {
  STEAM_KEY = 'steam_key',
  STEAM_GIFT = 'steam_gift',
  EPIC_KEY = 'epic_key',
  NINTENDO_KEY = 'nintendo_key',
  XBOX_KEY = 'xbox_key',
  PLAYSTATION_KEY = 'playstation_key'
}

registerEnumType(GameDeliveryType, {
  name: 'GameDeliveryType'
});

export enum GameRegion {
  RU = 'ru',
  KZ = 'kz',
  BY = 'by',
  UA = 'ua',
  PL = 'pl',
  TR = 'tr',
  ALL_WORLD = 'all_world',
  EUROPE = 'europe',
  ASIA = 'asia'
}

registerEnumType(GameRegion, {
  name: 'GameRegion'
});

export enum GameView {
  POPULAR = 'popular',
  NEW = 'new'
}

registerEnumType(GameView, {
  name: 'GameView'
});

export enum GameFilter {
  DLC = 'dlc',
  DISCOUNT = 'discount'
}

registerEnumType(GameFilter, {
  name: 'GameFilter'
});

export enum GameType {
  GAME = 'game',
  DLC = 'dlc'
}

registerEnumType(GameType, {
  name: 'GameType'
});
