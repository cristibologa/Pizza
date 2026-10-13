import { registerEnumType } from '@nestjs/graphql';

export enum GameOrderStatus {
  AWAITING_PAYMENT = 'awaiting_payment',
  PAID = 'paid'
}

registerEnumType(GameOrderStatus, {
  name: 'GameOrderStatus',
  description: 'Статус заказа игры'
});
