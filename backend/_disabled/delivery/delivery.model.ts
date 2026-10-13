import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '@/utils/services';

import { DeliveryPackageType, DeliveryPoint } from './entities';
import { DeliveryOption } from './entities/delivery-option.entity';
import { DeliveryOrder } from './modules';

@ObjectType()
export class DeliveryPointsResponse extends BaseResponse {
  @ApiProperty({ type: [DeliveryPoint], description: 'Пункты доставки' })
  @Field(() => [DeliveryPoint])
  points: DeliveryPoint[];
}

@ObjectType()
export class DeliveryPackageTypesResponse extends BaseResponse {
  @ApiProperty({ type: [DeliveryPackageType], description: 'Типы ' })
  @Field(() => [DeliveryPackageType])
  packages: DeliveryPackageType[];
}

@ObjectType()
export class DeliverResponse extends BaseResponse {
  @ApiProperty({ type: DeliveryOrder, description: 'Доставка' })
  @Field(() => DeliveryOrder)
  order: DeliveryOrder;
}

@ObjectType()
export class DeliveryOrdersResponse extends BaseResponse {
  @ApiProperty({ type: [DeliveryOrder], description: 'Доставки' })
  @Field(() => [DeliveryOrder])
  orders: DeliveryOrder[];
}

@ObjectType()
export class DeliveryOrderResponse extends BaseResponse {
  @ApiProperty({ type: DeliveryOrder, description: 'Доставка' })
  @Field(() => DeliveryOrder)
  order: DeliveryOrder;
}

@ObjectType()
export class CalculateDeliveryResponse extends BaseResponse {
  @ApiProperty({ type: [DeliveryOption], description: 'Опции доставки' })
  @Field(() => [DeliveryOption])
  options: DeliveryOption[];
}
