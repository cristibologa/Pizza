import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { TransactionOrderType, TransactionsService } from '@/modules/transactions';
import { BaseService } from '@/utils/base';
import { Result } from '@/utils/helpers';

import {
  CalculatePizzaOrderDto,
  CreatePizzaPaymentDto,
  GetPizzaCatalogDto,
  GetPizzaPaidOrderDto
} from './dto';
import { PizzaIngredient, PizzaOption, PizzaOrderedItem } from './entities';
import { PizzaOrdersService, PizzaStatus } from './modules/pizza-orders';
import { PizzaEntitySchema } from './pizza.schema';
import { TOPPINGS } from './pizzas.constants';
import { PizzaCategory, PizzaSize } from './pizzas.enums';

const FREE_DELIVERY_THRESHOLD = 1000;
const CURRENCY = 'RUB';

interface PricedItem {
  category: PizzaCategory;
  img: string;
  name: string;
  option?: PizzaOption;
  productId: Types.ObjectId;
  quantity: number;
  size?: PizzaSize;
  toppings?: PizzaIngredient[];
  totalPrice: number;
  unitPrice: number;
}

@Injectable()
export class PizzasService extends BaseService<PizzaEntitySchema> {
  constructor(
    @InjectModel(PizzaEntitySchema.name) private readonly pizzaModel: Model<PizzaEntitySchema>,
    private readonly pizzaOrdersService: PizzaOrdersService,
    private readonly transactionsService: TransactionsService
  ) {
    super(pizzaModel);
  }

  private async priceItems(items: PizzaOrderedItem[]) {
    return Promise.all(
      items.map(async (item) => {
        const product = await this.pizzaModel.findById(item._id);

        if (!product) {
          throw new BadRequestException(Result.fail(`Продукт ${item._id} не найден`));
        }

        const selectedSize = item.size
          ? (product.sizes ?? []).find(({ type }) => type === item.size)
          : undefined;
        if (item.size && !selectedSize) {
          throw new BadRequestException(
            Result.fail(`Размер ${item.size} недоступен для продукта ${item._id}`)
          );
        }
        const sizePrice = selectedSize?.price ?? 0;

        const selectedOption = item.option
          ? (product.options ?? []).find(({ type }) => type === item.option)
          : undefined;
        if (item.option && !selectedOption) {
          throw new BadRequestException(
            Result.fail(`Опция ${item.option} недоступна для продукта ${item._id}`)
          );
        }
        const optionPrice = selectedOption?.price ?? 0;

        const selectedToppings = (item.toppings ?? [])
          .map((type) => TOPPINGS.find((topping) => topping.type === type))
          .filter((topping): topping is (typeof TOPPINGS)[number] => Boolean(topping));
        const toppingsPrice = selectedToppings.reduce((acc, topping) => acc + topping.price, 0);

        const quantity = item.quantity ?? 1;
        const unitPrice = sizePrice + optionPrice + toppingsPrice;
        const totalPrice = unitPrice * quantity;

        return {
          productId: product._id,
          category: product.category,
          name: product.name,
          img: product.img,
          quantity,
          size: selectedSize,
          option: selectedOption,
          toppings: selectedToppings,
          unitPrice,
          totalPrice
        } as PricedItem;
      })
    );
  }

  private summarize(priced: PricedItem[]) {
    const itemsPrice = priced.reduce((acc, product) => acc + product.totalPrice, 0);
    const commissionAmount =
      itemsPrice >= FREE_DELIVERY_THRESHOLD ? 0 : FREE_DELIVERY_THRESHOLD - itemsPrice;
    const commission = { amount: commissionAmount, currency: CURRENCY };
    const totalPrice = itemsPrice + commissionAmount;

    return { itemsPrice, commission, totalPrice };
  }

  async getPizzaCatalog(getPizzaCatalogDto?: GetPizzaCatalogDto) {
    const catalog = await this.findMany({
      ...(getPizzaCatalogDto?.category && { category: getPizzaCatalogDto.category })
    });
    return Result.success({ catalog });
  }

  async calculatePizzaOrder(calculatePizzaOrderDto: CalculatePizzaOrderDto) {
    const priced = await this.priceItems(calculatePizzaOrderDto.items);
    const { itemsPrice, commission, totalPrice } = this.summarize(priced);

    const items = priced.map((price) => ({
      productId: price.productId,
      name: price.name,
      quantity: price.quantity,
      unitPrice: price.unitPrice,
      totalPrice: price.totalPrice
    }));

    return Result.success({ items, itemsPrice, commission, totalPrice });
  }

  async createPizzaPayment(createPizzaPaymentDto: CreatePizzaPaymentDto) {
    const { person, receiverAddress, items } = createPizzaPaymentDto;

    const priced = await this.priceItems(items);
    const { itemsPrice, commission, totalPrice } = this.summarize(priced);

    const order = await this.pizzaOrdersService.create({
      items,
      itemsPrice,
      commission,
      totalPrice,
      person,
      receiverAddress,
      status: PizzaStatus.AWAITING_PAYMENT,
      cancellable: true,
      transactionId: null
    });

    const transaction = await this.transactionsService.createTransaction({
      phone: person.phone,
      orderId: String(order._id),
      orderType: TransactionOrderType.PIZZA,
      amount: totalPrice,
      currency: 'RUB'
    });

    await this.pizzaOrdersService.updateById(String(order._id), {
      $set: { transactionId: String(transaction._id) }
    });

    return Result.success({
      order: { ...order, transactionId: String(transaction._id) }
    });
  }

  async getPizzaOrders(phone: string) {
    const orders = await this.pizzaOrdersService.findMany({
      'person.phone': phone,
      status: { $ne: PizzaStatus.AWAITING_PAYMENT }
    });

    return Result.success({ orders });
  }

  async getPizzaOrder(orderId: string, phone: string) {
    const order = await this.pizzaOrdersService.findById(orderId);

    if (!order || order.person.phone !== phone || order.status === PizzaStatus.AWAITING_PAYMENT) {
      throw new BadRequestException(Result.fail(`Заказ ${orderId} не найден`));
    }

    return Result.success({ order });
  }

  async getPizzaPaidOrder({ token }: GetPizzaPaidOrderDto) {
    const transaction = await this.transactionsService.consumeOrderAccessToken(
      token,
      TransactionOrderType.PIZZA
    );

    const order = await this.pizzaOrdersService.findById(transaction.orderId);

    if (!order || order.status === PizzaStatus.AWAITING_PAYMENT) {
      throw new BadRequestException(Result.fail(`Заказ ${transaction.orderId} не найден`));
    }

    return Result.success({ order });
  }

  async cancelPizzaOrder(orderId: string) {
    const order = await this.pizzaOrdersService.findById(orderId);

    if (!order) {
      throw new BadRequestException(Result.fail(`Заказ ${orderId} не найден`));
    }

    if (![PizzaStatus.AWAITING_PAYMENT, PizzaStatus.IN_PROCESSING].includes(order.status)) {
      throw new BadRequestException(Result.fail('Заказ нельзя отменить'));
    }

    const updatedOrder = (await this.pizzaOrdersService.updateById(orderId, {
      $set: { status: PizzaStatus.CANCELED, cancellable: false }
    }))!;

    return Result.success({ order: updatedOrder });
  }
}
