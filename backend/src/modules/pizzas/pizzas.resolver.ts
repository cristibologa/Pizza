import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '@/utils/decorators';
import { AuthorizedOnly } from '@/utils/guards';

import { User } from '../users';
import {
  CalculatePizzaOrderDto,
  CancelPizzaOrderDto,
  CreatePizzaPaymentDto,
  GetPizzaCatalogDto,
  GetPizzaOrderDto,
  GetPizzaPaidOrderDto
} from './dto';
import { PizzaProduct } from './pizza.entity';
import { PizzasService } from './pizzas.service';
import {
  CalculateOrderResponse,
  CancelPizzaOrderResponse,
  CreatePizzaPaymentResponse,
  GetPizzaCatalogResponse,
  GetPizzaOrderResponse,
  GetPizzaOrdersResponse
} from './responses';

@Resolver(() => PizzaProduct)
export class PizzasResolver {
  constructor(private readonly pizzaService: PizzasService) {}

  @Query(() => GetPizzaCatalogResponse, { description: 'Получить каталог' })
  async getCatalog(
    @Args() getPizzaCatalogDto: GetPizzaCatalogDto
  ): Promise<GetPizzaCatalogResponse> {
    return this.pizzaService.getPizzaCatalog(getPizzaCatalogDto);
  }

  @Query(() => CalculateOrderResponse, { description: 'Рассчитать стоимость корзины' })
  async calculatePizzaOrder(
    @Args('input') calculatePizzaOrderDto: CalculatePizzaOrderDto
  ): Promise<CalculateOrderResponse> {
    return this.pizzaService.calculatePizzaOrder(calculatePizzaOrderDto);
  }

  @Mutation(() => CreatePizzaPaymentResponse, {
    description: 'Создать заказ и транзакцию для оплаты'
  })
  async createPizzaPayment(
    @Args('input') createPizzaPaymentDto: CreatePizzaPaymentDto
  ): Promise<CreatePizzaPaymentResponse> {
    return this.pizzaService.createPizzaPayment(createPizzaPaymentDto);
  }

  @Query(() => GetPizzaOrdersResponse, { description: 'Получить все заказы' })
  @AuthorizedOnly()
  async getPizzaOrders(@CurrentUser() user: User): Promise<GetPizzaOrdersResponse> {
    return this.pizzaService.getPizzaOrders(user.phone);
  }

  @Query(() => GetPizzaOrderResponse, { description: 'Получить заказ' })
  @AuthorizedOnly()
  async getPizzaOrder(
    @Args() getPizzaOrderDto: GetPizzaOrderDto,
    @CurrentUser() user: User
  ): Promise<GetPizzaOrderResponse> {
    return this.pizzaService.getPizzaOrder(getPizzaOrderDto.orderId, user.phone);
  }

  @Query(() => GetPizzaOrderResponse, {
    description: 'Получить оплаченный заказ по одноразовому токену'
  })
  async getPizzaPaidOrder(
    @Args() getPizzaPaidOrderDto: GetPizzaPaidOrderDto
  ): Promise<GetPizzaOrderResponse> {
    return this.pizzaService.getPizzaPaidOrder(getPizzaPaidOrderDto);
  }

  @Mutation(() => CancelPizzaOrderResponse, { description: 'Отменить заказ' })
  @AuthorizedOnly()
  async cancelPizzaOrder(
    @Args() cancelPizzaOrderDto: CancelPizzaOrderDto
  ): Promise<CancelPizzaOrderResponse> {
    return this.pizzaService.cancelPizzaOrder(cancelPizzaOrderDto.orderId);
  }
}
