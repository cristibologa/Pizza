import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { UsersModule } from '@/modules/users';

import { CarsController } from './cars.controller';
import { CarsMutation } from './cars.mutation';
import { CarsQuery } from './cars.query';
import { CarsService } from './cars.service';
import { CarRentModule } from './modules';

@Module({
  controllers: [CarsController],
  exports: [],
  imports: [UsersModule, CarRentModule, ScheduleModule.forRoot()],
  providers: [CarsService, CarsQuery, CarsMutation]
})
export class CarsModule {}
