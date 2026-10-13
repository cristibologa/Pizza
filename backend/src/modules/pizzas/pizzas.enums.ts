import { registerEnumType } from '@nestjs/graphql';

export enum PizzaIngredientType {
  PINEAPPLE = 'pineapple',
  MOZZARELLA = 'mozzarella',
  PEPPERONI = 'pepperoni',
  GREEN_PEPPER = 'green_pepper',
  MUSHROOMS = 'mushrooms',
  BASIL = 'basil',
  CHEDDAR = 'cheddar',
  PARMESAN = 'parmesan',
  FETA = 'feta',
  HAM = 'ham',
  PICKLE = 'pickle',
  TOMATO = 'tomato',
  BACON = 'bacon',
  ONION = 'onion',
  CHILE = 'chile',
  SHRIMP = 'shrimp',
  CHICKEN_FILLET = 'chicken_fillet',
  MEATBALLS = 'meatballs'
}

registerEnumType(PizzaIngredientType, {
  name: 'PizzaIngredientType',
  description: 'Ингредиенты'
});

export enum PizzaSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

registerEnumType(PizzaSize, {
  name: 'PizzaSize',
  description: 'Размер продукта'
});

export enum PizzaCategory {
  PIZZA = 'pizza',
  BREAKFAST = 'breakfast',
  WINGS = 'wings',
  MILKSHAKE = 'milkshake'
}

registerEnumType(PizzaCategory, {
  name: 'PizzaCategory',
  description: 'Категория продукта'
});

export enum PizzaOptionType {
  CRUST_THIN = 'crust_thin',
  CRUST_THICK = 'crust_thick',
  CRUST_CHEESE = 'crust_cheese',
  CREAM_WITH = 'cream_with',
  CREAM_WITHOUT = 'cream_without'
}

registerEnumType(PizzaOptionType, {
  name: 'PizzaOptionType',
  description: 'Доп-опции продукта'
});
