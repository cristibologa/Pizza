import { Controller } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';

// import { CarRentService, CarRentStatus } from '@/modules/cars/modules/car-rent';
// import { DeliveryOrderService, DeliveryStatus } from '@/modules/delivery/modules/delivery-order';
// import { PizzaOrderService, PizzaStatus } from '@/modules/pizza/modules/pizza-order';

@Controller('/cron')
export class CronController {
  // constructor(
  //   private readonly deliveryOrderService: DeliveryOrderService,
  //   private readonly pizzaOrderService: PizzaOrderService,
  //   private readonly carRentService: CarRentService
  // ) {
  //   super();
  // }

  // @Cron('*/20 * * * *')
  // async handleDeliveryCron() {
  //   const deliveries = await this.deliveryOrderService.find({
  //     $and: [
  //       { status: { $ne: DeliveryStatus.SUCCESS } },
  //       { status: { $ne: DeliveryStatus.CANCELED } }
  //     ]
  //   });
  //   const randomDeliveries = deliveries.filter(() => Math.random() < 0.3);
  //   if (!randomDeliveries.length) return;
  //   const updatedResult = await this.deliveryOrderService.updateMany(
  //     { _id: { $in: randomDeliveries.map((delivery) => delivery._id) } },
  //     { $inc: { status: 1 }, $set: { cancellable: false } }
  //   );
  //   console.log('DELIVERY CRON:', new Date(), 'updated', updatedResult.modifiedCount);
  // }
  // @Cron('0 0 * * *')
  // async handleCarsCron() {
  //   const today = new Date().setHours(0, 0, 0, 0);
  //   const updatedResult = await this.carRentService.updateMany(
  //     {
  //       status: CarRentStatus.BOOKED,
  //       startDate: { $gte: today }
  //     },
  //     { $set: { status: CarRentStatus.ACTIVE } }
  //   );
  //   console.log('CAR RENT CRON:', new Date(), 'updated', updatedResult.modifiedCount);
  // }
}
