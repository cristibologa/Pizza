import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PizzaOrderEntitySchema, PizzaOrderSchema } from './pizza-order.schema';
import { PizzaOrdersCron } from './pizza-orders.cron';
import { PizzaOrdersListener } from './pizza-orders.listener';
import { PizzaOrdersService } from './pizza-orders.service';

@Module({
  exports: [PizzaOrdersService],
  imports: [
    MongooseModule.forFeature([{ name: PizzaOrderEntitySchema.name, schema: PizzaOrderSchema }])
  ],
  providers: [PizzaOrdersCron, PizzaOrdersListener, PizzaOrdersService]
})
export class PizzaOrdersModule {}
