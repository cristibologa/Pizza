import { registerEnumType } from '@nestjs/graphql';

export enum PizzaStatus {
  AWAITING_PAYMENT = 'awaiting_payment',
  IN_PROCESSING = 'in_processing',
  WAITING_COURIER = 'waiting_courier',
  ON_MY_WAY = 'on_my_way',
  SUCCESS = 'success',
  CANCELED = 'canceled'
}

registerEnumType(PizzaStatus, {
  name: 'PizzaStatus',
  description: 'Статус заказа'
});
