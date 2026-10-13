import { Car } from '../entities';
import { BodyType, Brand, Color, Steering, Transmission } from './enums';

export const CARS: Car[] = [
  {
    id: '1',
    name: 'Haval Jolion',
    brand: Brand.HAVAL,
    media: [
      { url: '/static/images/cars/haval-jolion/haval-jolion-cover.webp', isCover: true },
      { url: '/static/images/cars/haval-jolion/haval-jolion-front.webp', isCover: false },
      { url: '/static/images/cars/haval-jolion/haval-jolion-back.webp', isCover: false }
    ],
    transmission: Transmission.AUTOMATIC,
    price: 4200,
    location: 'Москва, ул. Садовая, 5',
    color: Color.SILVER,
    bodyType: BodyType.SUV,
    steering: Steering.LEFT
  },
  {
    id: '2',
    name: 'Тачка садовая',
    brand: Brand.GARDEN_CAR,
    media: [
      { url: '/static/images/cars/garden-car/garden-car-cover.jpg', isCover: true },
      { url: '/static/images/cars/garden-car/garden-car-front.jpg', isCover: false },
      { url: '/static/images/cars/garden-car/garden-car-profile.jpg', isCover: false },
      { url: '/static/images/cars/garden-car/garden-car-back.jpg', isCover: false }
    ],
    transmission: Transmission.MANUAL,
    price: 1000,
    location: 'Астрахань, ул. Ленинская, 17',
    color: Color.ORANGE,
    bodyType: BodyType.CABRIOLET,
    steering: Steering.LEFT
  },
  {
    id: '3',
    name: 'Hyundai Sonata 2.0 AT',
    brand: Brand.HYUNDAI,
    media: [{ url: '/static/images/cars/hyundai-sonata/hyundai-sonata-cover.webp', isCover: true }],
    transmission: Transmission.AUTOMATIC,
    price: 3900,
    location: 'Санкт-Петербург, Невский проспект, 22',
    color: Color.WHITE,
    bodyType: BodyType.SEDAN,
    steering: Steering.LEFT
  },
  {
    id: '4',
    name: 'Телега',
    brand: Brand.GROCERY_CART,
    media: [
      { url: '/static/images/cars/grocery-cart/grocery-cart-cover.webp', isCover: true },
      { url: '/static/images/cars/grocery-cart/grocery-cart-front.webp', isCover: false },
      { url: '/static/images/cars/grocery-cart/grocery-cart-profile.webp', isCover: false },
      { url: '/static/images/cars/grocery-cart/grocery-cart-back.webp', isCover: false }
    ],
    transmission: Transmission.MANUAL,
    price: 100,
    location: 'Екатеринбург, Заречный пер., 9',
    color: Color.GREY,
    bodyType: BodyType.CABRIOLET,
    steering: Steering.LEFT
  },
  {
    id: '5',
    name: 'Volkswagen Polo 1.6 AT',
    brand: Brand.VOLKSWAGEN,
    media: [
      { url: '/static/images/cars/volkswagen-polo/volkswagen-polo-cover.webp', isCover: true }
    ],
    transmission: Transmission.AUTOMATIC,
    price: 3100,
    location: 'Новосибирск, ул. Ленина, 5',
    color: Color.WHITE,
    bodyType: BodyType.SEDAN,
    steering: Steering.LEFT
  },
  {
    id: '6',
    name: 'Стиральная машина',
    brand: Brand.HAIER,
    media: [
      { url: '/static/images/cars/washing-machine/washing-machine-cover.webp', isCover: true },
      { url: '/static/images/cars/washing-machine/washing-machine-front.webp', isCover: false },
      { url: '/static/images/cars/washing-machine/washing-machine-profile.webp', isCover: false },
      { url: '/static/images/cars/washing-machine/washing-machine-back.webp', isCover: false }
    ],
    transmission: Transmission.AUTOMATIC,
    price: 3333,
    location: 'Екатеринбург, ул. Мира, 45',
    color: Color.GREY,
    bodyType: BodyType.SUV,
    steering: Steering.LEFT
  },
  {
    id: '7',
    name: 'Kia Rio 1.4 AT',
    brand: Brand.KIA,
    media: [{ url: '/static/images/cars/kia-rio-white/kia-rio-white-cover.webp', isCover: true }],
    transmission: Transmission.AUTOMATIC,
    price: 3100,
    location: 'Новосибирск, ул. Ленина, 5',
    color: Color.WHITE,
    bodyType: BodyType.SEDAN,
    steering: Steering.LEFT
  },
  {
    id: '8',
    name: 'Кресло каталка',
    brand: Brand.INVALID,
    media: [
      { url: '/static/images/cars/wheelchair/wheelchair-cover.jpg', isCover: true },
      { url: '/static/images/cars/wheelchair/wheelchair-front.jpg', isCover: false },
      { url: '/static/images/cars/wheelchair/wheelchair-profile.jpg', isCover: false },
      { url: '/static/images/cars/wheelchair/wheelchair-back.jpg', isCover: false }
    ],
    transmission: Transmission.AUTOMATIC,
    price: 6666,
    location: 'Новосибирск, ул. Ленина, 5',
    color: Color.BLACK,
    bodyType: BodyType.CABRIOLET,
    steering: Steering.RIGHT
  },
  {
    id: '9',
    name: 'Hyundai Solaris 1.6 AT',
    brand: Brand.HYUNDAI,
    media: [
      { url: '/static/images/cars/hyundai-solaris/hyundai-solaris-cover.webp', isCover: true }
    ],
    transmission: Transmission.MANUAL,
    price: 3200,
    location: 'Екатеринбург, ул. Мира, 45',
    color: Color.BLACK,
    bodyType: BodyType.SEDAN,
    steering: Steering.LEFT
  },
  {
    id: '10',
    name: 'Kia Rio 1.6 AT',
    brand: Brand.KIA,
    media: [{ url: '/static/images/cars/kia-rio-red/kia-rio-red-cover.webp', isCover: true }],
    transmission: Transmission.AUTOMATIC,
    price: 2500,
    location: 'Екатеринбург, ул. Мира, 45',
    color: Color.RED,
    bodyType: BodyType.SEDAN,
    steering: Steering.LEFT
  },
  {
    id: '11',
    name: 'Haval H3',
    brand: Brand.HAVAL,
    media: [{ url: '/static/images/cars/haval-h3/haval-h3-cover.webp', isCover: true }],
    transmission: Transmission.MANUAL,
    price: 3500,
    location: 'Екатеринбург, ул. Малышева, 15',
    color: Color.GREY,
    bodyType: BodyType.SUV,
    steering: Steering.LEFT
  },
  {
    id: '12',
    name: 'Haval F7 4WD',
    brand: Brand.HAVAL,
    media: [
      { url: '/static/images/cars/haval-f7/haval-f7-cover.webp', isCover: true },
      { url: '/static/images/cars/haval-f7/haval-f7-front.webp', isCover: false },
      { url: '/static/images/cars/haval-f7/haval-f7-profile.webp', isCover: false },
      { url: '/static/images/cars/haval-f7/haval-f7-back.webp', isCover: false }
    ],
    transmission: Transmission.AUTOMATIC,
    price: 4500,
    location: 'Новосибирск, ул. Ленина, 5',
    color: Color.BLUE,
    bodyType: BodyType.SUV,
    steering: Steering.LEFT
  },
  {
    id: '13',
    name: 'Hyundai Palisade HT',
    brand: Brand.HYUNDAI,
    media: [
      { url: '/static/images/cars/hyundai-palisade/hyundai-palisade-cover.webp', isCover: true },
      { url: '/static/images/cars/hyundai-palisade/hyundai-palisade-front.webp', isCover: false },
      { url: '/static/images/cars/hyundai-palisade/hyundai-palisade-profile.webp', isCover: false }
    ],
    transmission: Transmission.AUTOMATIC,
    price: 5000,
    location: 'Новосибирск, ул. Ленина, 5',
    color: Color.WHITE,
    bodyType: BodyType.HATCHBACK,
    steering: Steering.LEFT
  },
  {
    id: '14',
    name: 'Geely Preface',
    brand: Brand.GEELY,
    media: [{ url: '/static/images/cars/geely-preface/geely-preface-cover.webp', isCover: true }],
    transmission: Transmission.MANUAL,
    price: 4200,
    location: 'Екатеринбург, ул. Малышева, 15',
    color: Color.BLACK,
    bodyType: BodyType.SEDAN,
    steering: Steering.LEFT
  },
  {
    id: '15',
    name: 'Geely Emgrand',
    brand: Brand.GEELY,
    media: [
      { url: '/static/images/cars/geely-emgrand/geely-emgrand-cover.webp', isCover: true },
      { url: '/static/images/cars/geely-emgrand/geely-emgrand-front.webp', isCover: false },
      { url: '/static/images/cars/geely-emgrand/geely-emgrand-profile.webp', isCover: false },
      { url: '/static/images/cars/geely-emgrand/geely-emgrand-back.webp', isCover: false }
    ],
    transmission: Transmission.AUTOMATIC,
    price: 4000,
    location: 'Екатеринбург, ул. Мира, 45',
    color: Color.SILVER,
    bodyType: BodyType.SEDAN,
    steering: Steering.LEFT
  },
  {
    id: '16',
    name: 'Kia Rio 1.4 AT',
    brand: Brand.KIA,
    media: [
      { url: '/static/images/cars/kia-rio-black/kia-rio-black-cover.webp', isCover: true },
      { url: '/static/images/cars/kia-rio-black/kia-rio-black-profile.webp', isCover: false },
      { url: '/static/images/cars/kia-rio-black/kia-rio-black-back.webp', isCover: false }
    ],
    transmission: Transmission.MANUAL,
    price: 3100,
    location: 'Новосибирск, ул. Ленина, 5',
    color: Color.BLACK,
    bodyType: BodyType.SEDAN,
    steering: Steering.LEFT
  }
];
