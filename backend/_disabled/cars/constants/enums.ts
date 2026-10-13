import { registerEnumType } from '@nestjs/graphql';

export enum Brand {
  HAVAL = 'haval',
  HYUNDAI = 'hyundai',
  VOLKSWAGEN = 'volkswagen',
  KIA = 'kia',
  GEELY = 'geely',
  MERCEDES = 'mercedes',
  GARDEN_CAR = 'garden_car',
  GROCERY_CART = 'grocery_cart',
  HAIER = 'haier',
  INVALID = 'invalid'
}

export enum BodyType {
  SEDAN = 'sedan',
  SUV = 'suv',
  COUPE = 'coupe',
  HATCHBACK = 'hatchback',
  CABRIOLET = 'cabriolet'
}

export enum Steering {
  LEFT = 'left',
  RIGHT = 'right'
}

export enum Transmission {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual'
}

export enum Color {
  BLACK = 'black',
  WHITE = 'white',
  RED = 'red',
  SILVER = 'silver',
  BLUE = 'blue',
  GREY = 'grey',
  ORANGE = 'orange'
}

registerEnumType(Brand, { name: 'Brand' });
registerEnumType(Transmission, { name: 'Transmission' });
registerEnumType(Color, { name: 'Color' });
registerEnumType(BodyType, { name: 'BodyType' });
registerEnumType(Steering, { name: 'Steering' });
