import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CarRent, CarRentSchema } from './car-rent.entity';
import { CarRentService } from './car-rent.service';

@Module({
  exports: [CarRentService],
  imports: [MongooseModule.forFeature([{ name: CarRent.name, schema: CarRentSchema }])],
  providers: [CarRentService]
})
export class CarRentModule {}
