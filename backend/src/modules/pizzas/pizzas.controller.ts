import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

import type { User } from '@/modules/users';

import { ErrorResponse } from '@/utils/base';
import { CurrentUser } from '@/utils/decorators';
import { AuthorizedOnly } from '@/utils/guards';

import {
  CalculatePizzaOrderDto,
  CancelPizzaOrderDto,
  CreatePizzaPaymentDto,
  GetPizzaCatalogDto,
  GetPizzaOrderDto,
  GetPizzaPaidOrderDto
} from './dto';
import { PizzaCategory } from './pizzas.enums';
import { PizzasService } from './pizzas.service';
import {
  CalculateOrderResponse,
  CancelPizzaOrderResponse,
  CreatePizzaPaymentResponse,
  GetPizzaCatalogResponse,
  GetPizzaOrderResponse,
  GetPizzaOrdersResponse
} from './responses';

@ApiTags('🍕 pizzas')
@Controller('/pizzas')
export class PizzasController {
  constructor(private readonly pizzaService: PizzasService) {}

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Некорректные параметры запроса'
  })
  @ApiOperation({ summary: 'Получить каталог' })
  @ApiQuery({
    description: 'Фильтр по категории',
    enum: PizzaCategory,
    required: false,
    enumName: 'PizzaCategory',
    name: 'category'
  })
  @ApiResponse({ type: GetPizzaCatalogResponse, description: 'catalog', status: 200 })
  @Get('/catalog')
  async getPizzaCatalog(
    @Query() getPizzaCatalog: GetPizzaCatalogDto
  ): Promise<GetPizzaCatalogResponse> {
    return this.pizzaService.getPizzaCatalog(getPizzaCatalog);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Некорректная корзина, продукт, размер или опция не найдены'
  })
  @ApiOperation({ summary: 'Рассчитать стоимость корзины и комиссию' })
  @ApiResponse({ type: CalculateOrderResponse, description: 'calculate', status: 200 })
  @Post('/calculate')
  async calculatePizzaOrder(
    @Body() calculateOrderDto: CalculatePizzaOrderDto
  ): Promise<CalculateOrderResponse> {
    return this.pizzaService.calculatePizzaOrder(calculateOrderDto);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Некорректные данные заказа, продукт, размер или опция не найдены'
  })
  @ApiOperation({ summary: 'Создать заказ и транзакцию для оплаты' })
  @ApiResponse({ type: CreatePizzaPaymentResponse, description: 'payment', status: 200 })
  @Post('/payment')
  async createPizzaPayment(
    @Body() createPizzaPaymentDto: CreatePizzaPaymentDto
  ): Promise<CreatePizzaPaymentResponse> {
    return this.pizzaService.createPizzaPayment(createPizzaPaymentDto);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Пользователь не найден'
  })
  @ApiOperation({ summary: 'Получить все заказы' })
  @ApiResponse({ type: GetPizzaOrdersResponse, description: 'orders', status: 200 })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: 'Не авторизован'
  })
  @Get('/orders')
  @AuthorizedOnly()
  async getPizzaOrders(@CurrentUser() user: User): Promise<GetPizzaOrdersResponse> {
    return this.pizzaService.getPizzaOrders(user.phone);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Не указан или недействителен одноразовый токен доступа, заказ не найден'
  })
  @ApiOperation({ summary: 'Получить оплаченный заказ по одноразовому токену' })
  @ApiQuery({
    type: String,
    description: 'Одноразовый токен доступа',
    example: '1f2e3d4c5b6a7980abcdef1234567890abcdef1234567890abcdef1234567890',
    required: true,
    name: 'token'
  })
  @ApiResponse({ type: GetPizzaOrderResponse, description: 'order', status: 200 })
  @Get('/orders/paid')
  async getPizzaPaidOrder(
    @Query() getPizzaPaidOrderDto: GetPizzaPaidOrderDto
  ): Promise<GetPizzaOrderResponse> {
    return this.pizzaService.getPizzaPaidOrder(getPizzaPaidOrderDto);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Пользователь или заказ не найдены'
  })
  @ApiOperation({ summary: 'Получить заказ' })
  @ApiResponse({ type: GetPizzaOrderResponse, description: 'order', status: 200 })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: 'Не авторизован'
  })
  @Get('/orders/:orderId')
  @AuthorizedOnly()
  async getPizzaOrder(
    @Param() getPizzaOrderDto: GetPizzaOrderDto,
    @CurrentUser() user: User
  ): Promise<GetPizzaOrderResponse> {
    return this.pizzaService.getPizzaOrder(getPizzaOrderDto.orderId, user.phone);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Пользователь или заказ не найдены, либо заказ нельзя отменить'
  })
  @ApiOperation({ summary: 'Отменить заказ' })
  @ApiResponse({ type: CancelPizzaOrderResponse, description: 'order cancel', status: 200 })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: 'Не авторизован'
  })
  @Patch('/orders/:orderId/cancel')
  @AuthorizedOnly()
  async cancelPizzaOrder(
    @Param() cancelPizzaOrderDto: CancelPizzaOrderDto
  ): Promise<CancelPizzaOrderResponse> {
    return this.pizzaService.cancelPizzaOrder(cancelPizzaOrderDto.orderId);
  }
}
