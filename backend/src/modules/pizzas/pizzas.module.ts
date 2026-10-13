import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TransactionsModule } from '@/modules/transactions';
import { UsersModule } from '@/modules/users';

import { PizzaOrdersModule } from './modules/pizza-orders';
import { PizzaEntitySchema, PizzaSchema } from './pizza.schema';
import { PizzasController } from './pizzas.controller';
import { PizzasResolver } from './pizzas.resolver';
import { PizzasService } from './pizzas.service';
import { PizzasSeeder } from './seed';

@Module({
  controllers: [PizzasController],
  exports: [],
  imports: [
    PizzaOrdersModule,
    UsersModule,
    TransactionsModule,
    MongooseModule.forFeature([{ name: PizzaEntitySchema.name, schema: PizzaSchema }])
  ],
  providers: [PizzasResolver, PizzasService, PizzasSeeder]
})
export class PizzasModule {}
