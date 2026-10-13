import { PizzaIngredientType } from './pizzas.enums';

export const TOPPINGS: { type: PizzaIngredientType; price: number; img: string }[] = [
  {
    type: PizzaIngredientType.PINEAPPLE,
    price: 80,
    img: '/static/images/ingredient/pineapple.png'
  },
  {
    type: PizzaIngredientType.GREEN_PEPPER,
    price: 60,
    img: '/static/images/ingredient/green_pepper.png'
  },
  {
    type: PizzaIngredientType.MUSHROOMS,
    price: 80,
    img: '/static/images/ingredient/mushrooms.png'
  },
  { type: PizzaIngredientType.BACON, price: 80, img: '/static/images/ingredient/bacon.png' },
  { type: PizzaIngredientType.SHRIMP, price: 80, img: '/static/images/ingredient/shrimps.png' },
  { type: PizzaIngredientType.HAM, price: 80, img: '/static/images/ingredient/ham.png' },
  {
    type: PizzaIngredientType.MOZZARELLA,
    price: 70,
    img: '/static/images/ingredient/mozzarella.png'
  },
  {
    type: PizzaIngredientType.PEPPERONI,
    price: 120,
    img: '/static/images/ingredient/peperoni.png'
  },
  {
    type: PizzaIngredientType.CHICKEN_FILLET,
    price: 80,
    img: '/static/images/ingredient/chicken_fillet.png'
  },
  { type: PizzaIngredientType.ONION, price: 80, img: '/static/images/ingredient/onion.png' },
  { type: PizzaIngredientType.BASIL, price: 80, img: '/static/images/ingredient/basil.png' },
  { type: PizzaIngredientType.CHILE, price: 80, img: '/static/images/ingredient/chile.png' },
  { type: PizzaIngredientType.CHEDDAR, price: 80, img: '/static/images/ingredient/cheddar.png' },
  {
    type: PizzaIngredientType.MEATBALLS,
    price: 80,
    img: '/static/images/ingredient/meatballs.png'
  },
  { type: PizzaIngredientType.PICKLE, price: 80, img: '/static/images/ingredient/pickle.png' },
  { type: PizzaIngredientType.TOMATO, price: 80, img: '/static/images/ingredient/tomato.png' },
  { type: PizzaIngredientType.FETA, price: 80, img: '/static/images/ingredient/feta.png' }
];
