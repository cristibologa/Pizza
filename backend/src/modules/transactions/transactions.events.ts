import { TransactionOrderType } from './transactions.enums';

export const TRANSACTION_EVENTS = {
  PAID: 'transaction.paid',
  EXPIRED: 'transaction.expired'
} as const;

export interface TransactionPaidEvent {
  orderId: string;
  orderType: TransactionOrderType;
  transactionId: string;
}

export interface TransactionExpiredEvent {
  orders: { orderId: string; orderType: TransactionOrderType; transactionId: string }[];
}
