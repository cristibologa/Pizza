import { Injectable } from '@nestjs/common';

import { CARS } from './constants';
import { GetCarsSearchDto } from './dto';
import { CarsPaginationMeta } from './entities';
import { CarRentService, CarRentStatus } from './modules';

interface GetFilteredCarsParams {
  filters: GetCarsSearchDto;
}

interface GetPaginationParams<Car> {
  items: Car[];
  limit?: number;
  page?: number;
}

interface PaginationResult<Car> {
  data: Car[];
  meta: CarsPaginationMeta;
}

@Injectable()
export class CarsService {
  constructor(private readonly carRentService: CarRentService) {}

  getCars() {
    return CARS;
  }

  getCar(id: string) {
    const cars = this.getCars();
    return cars.find((car) => car.id === id);
  }

  getFilteredCars({ filters }: GetFilteredCarsParams) {
    let filteredCars = this.getCars();

    if (filters.brand?.length) {
      filteredCars = filteredCars.filter((car) => filters.brand.includes(car.brand));
    }

    if (filters.bodyType?.length) {
      filteredCars = filteredCars.filter((car) => filters.bodyType.includes(car.bodyType));
    }

    if (filters.color?.length) {
      filteredCars = filteredCars.filter((car) => filters.color.includes(car.color));
    }

    if (filters.transmission) {
      filteredCars = filteredCars.filter((car) => filters.transmission.includes(car.transmission));
    }

    if (filters.steering) {
      filteredCars = filteredCars.filter((car) => filters.steering.includes(car.steering));
    }

    if (typeof filters.minPrice === 'number') {
      filteredCars = filteredCars.filter((car) => car.price >= filters.minPrice);
    }

    if (typeof filters.maxPrice === 'number') {
      filteredCars = filteredCars.filter((car) => car.price <= filters.maxPrice);
    }

    if (filters.search) {
      filteredCars = filteredCars.filter((car) =>
        Object.values(car).some((value) => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(filters.search.toLowerCase());
          }
          if (typeof value === 'number') {
            return value.toString().includes(filters.search.toLowerCase());
          }
          return false;
        })
      );
    }

    if (filters.startDate && filters.endDate) {
      filteredCars = filteredCars.filter(async (car) => {
        const overlappingRents = await this.carRentService.find({
          'carInfo.id': car.id,
          status: CarRentStatus.BOOKED,
          startDate: { $lt: filters.endDate },
          endDate: { $gt: filters.startDate }
        });

        return overlappingRents.length === 0;
      });
    }

    return filteredCars;
  }

  getPagination<Car>({
    items,
    page = 1,
    limit = 10
  }: GetPaginationParams<Car>): PaginationResult<Car> {
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const data = items.slice(startIndex, endIndex);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }
}
