import type { Film } from '../entities';

import { Profession, Rating } from '../entities';

export const FILMS: Film[] = [
  {
    id: '1',
    name: 'Варкрафт',
    originalName: 'Warcraft',
    description:
      'Мир Азерота оказывается на грани войны, когда через портал в него приходят орки, ищущие новый дом для своего народа.',
    releaseDate: '25 мая 2016',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Трэвис Фиммел',
        photo: '/static/images/cinema/actors/travis-fimmel.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Пола Пэттон',
        photo: '/static/images/cinema/actors/paula-patton.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Бен Фостер',
        photo: '/static/images/cinema/actors/ben-foster.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Доминик Купер',
        photo: '/static/images/cinema/actors/dominic-cooper.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Тоби Кеббелл',
        photo: '/static/images/cinema/actors/toby-kebbell.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Дункан Джонс',
        photo: '/static/images/cinema/directors/duncan-jones.webp'
      }
    ],
    runtime: 123,
    ageRating: Rating.PG13,
    genres: ['фэнтези', 'боевик', 'приключения'],
    userRatings: {
      kinopoisk: '7.6',
      imdb: '6.7'
    },
    img: '/static/images/cinema/films/warcraft.webp',
    country: {
      id: 1,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '2',
    name: 'Один дома',
    originalName: 'Home Alone',
    description:
      'Восьмилетний Кевин случайно остается дома один на Рождество и вынужден защищать дом от двух незадачливых грабителей.',
    releaseDate: '10 ноября 1990',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Маколей Калкин',
        photo: '/static/images/cinema/actors/macaulay-culkin.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Джо Пеши',
        photo: '/static/images/cinema/actors/joe-pesci.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Дэниел Стерн',
        photo: '/static/images/cinema/actors/daniel-stern.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: "Кэтрин О'Хара",
        photo: '/static/images/cinema/actors/catherine-ohara.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Джон Хёрд',
        photo: '/static/images/cinema/actors/john-heard.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Крис Коламбус',
        photo: '/static/images/cinema/directors/chris-columbus.webp'
      }
    ],
    runtime: 103,
    ageRating: Rating.PG,
    genres: ['комедия', 'семейный'],
    userRatings: {
      kinopoisk: '8.3',
      imdb: '7.7'
    },
    img: '/static/images/cinema/films/home-alone.webp',
    country: {
      id: 2,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '3',
    name: 'Остров проклятых',
    originalName: 'Shutter Island',
    description:
      'Два федеральных маршала прибывают на изолированный остров, чтобы расследовать исчезновение пациентки психиатрической клиники.',
    releaseDate: '13 февраля 2010',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Леонардо ДиКаприо',
        photo: '/static/images/cinema/actors/leonardo-dicaprio.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Марк Руффало',
        photo: '/static/images/cinema/actors/mark-ruffalo.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Бен Кингсли',
        photo: '/static/images/cinema/actors/ben-kingsley.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Мишель Уильямс',
        photo: '/static/images/cinema/actors/michelle-williams.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Макс фон Сюдов',
        photo: '/static/images/cinema/actors/max-von-sydow.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Мартин Скорсезе',
        photo: '/static/images/cinema/directors/martin-scorsese.webp'
      }
    ],
    runtime: 138,
    ageRating: Rating.R,
    genres: ['триллер', 'детектив', 'драма'],
    userRatings: {
      kinopoisk: '8.5',
      imdb: '8.2'
    },
    img: '/static/images/cinema/films/shutter-island.webp',
    country: {
      id: 3,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '4',
    name: 'Хроники Риддика',
    originalName: 'The Chronicles of Riddick',
    description:
      'Беглец Риддик оказывается втянут в войну с безжалостной армией некромонгеров, покоряющей планеты одну за другой.',
    releaseDate: '11 июня 2004',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Вин Дизель',
        photo: '/static/images/cinema/actors/vin-diesel.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Колм Фиор',
        photo: '/static/images/cinema/actors/colm-feore.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Тэнди Ньютон',
        photo: '/static/images/cinema/actors/thandiwe-newton.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Джуди Денч',
        photo: '/static/images/cinema/actors/judi-dench.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Карл Урбан',
        photo: '/static/images/cinema/actors/karl-urban.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Дэвид Туи',
        photo: '/static/images/cinema/directors/david-twohy.webp'
      }
    ],
    runtime: 119,
    ageRating: Rating.PG13,
    genres: ['фантастика', 'боевик', 'приключения'],
    userRatings: {
      kinopoisk: '7.2',
      imdb: '6.6'
    },
    img: '/static/images/cinema/films/the-chronicles-of-riddick.webp',
    country: {
      id: 4,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '5',
    name: 'Маска',
    originalName: 'The Mask',
    description:
      'Скромный банковский служащий находит древнюю маску, которая превращает его в харизматичного и хаотичного героя.',
    releaseDate: '29 июля 1994',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Джим Керри',
        photo: '/static/images/cinema/actors/jim-carrey.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Кэмерон Диас',
        photo: '/static/images/cinema/actors/cameron-diaz.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Питер Ригерт',
        photo: '/static/images/cinema/actors/peter-riegert.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Питер Грин',
        photo: '/static/images/cinema/actors/peter-greene.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Эми Ясбек',
        photo: '/static/images/cinema/actors/amy-yasbeck.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Чак Рассел',
        photo: '/static/images/cinema/directors/chuck-russell.webp'
      }
    ],
    runtime: 101,
    ageRating: Rating.PG13,
    genres: ['комедия', 'фэнтези'],
    userRatings: {
      kinopoisk: '7.8',
      imdb: '6.9'
    },
    img: '/static/images/cinema/films/the-mask.webp',
    country: {
      id: 5,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '6',
    name: 'Молчание ягнят',
    originalName: 'The Silence of the Lambs',
    description:
      'Молодая агентка ФБР обращается за помощью к заключённому психиатру и каннибалу Ганнибалу Лектеру, чтобы поймать серийного убийцу.',
    releaseDate: '30 января 1991',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Джоди Фостер',
        photo: '/static/images/cinema/actors/jodie-foster.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Энтони Хопкинс',
        photo: '/static/images/cinema/actors/anthony-hopkins.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Скотт Гленн',
        photo: '/static/images/cinema/actors/scott-glenn.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Тед Ливайн',
        photo: '/static/images/cinema/actors/ted-levine.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Энтони Хилд',
        photo: '/static/images/cinema/actors/anthony-heald.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Джонатан Демми',
        photo: '/static/images/cinema/directors/jonathan-demme.webp'
      }
    ],
    runtime: 118,
    ageRating: Rating.R,
    genres: ['триллер', 'детектив', 'криминал'],
    userRatings: {
      kinopoisk: '8.3',
      imdb: '8.6'
    },
    img: '/static/images/cinema/films/the-silence-of-the-lambs.webp',
    country: {
      id: 6,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '7',
    name: 'Интерстеллар',
    originalName: 'Interstellar',
    description:
      'Группа исследователей отправляется через червоточину в поисках нового дома для человечества.',
    releaseDate: '26 октября 2014',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Мэттью Макконахи',
        photo: '/static/images/cinema/actors/matthew-mcconaughey.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Энн Хэтэуэй',
        photo: '/static/images/cinema/actors/anne-hathaway.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Джессика Честейн',
        photo: '/static/images/cinema/actors/jessica-chastain.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Майкл Кейн',
        photo: '/static/images/cinema/actors/michael-caine.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Маккензи Фой',
        photo: '/static/images/cinema/actors/mackenzie-foy.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Кристофер Нолан',
        photo: '/static/images/cinema/directors/christopher-nolan.webp'
      }
    ],
    runtime: 169,
    ageRating: Rating.PG13,
    genres: ['фантастика', 'драма', 'приключения'],
    userRatings: {
      kinopoisk: '8.7',
      imdb: '8.7'
    },
    img: '/static/images/cinema/films/interstellar.webp',
    country: {
      id: 7,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '8',
    name: 'Очень страшное кино',
    originalName: 'Scary Movie',
    description:
      'Пародийная комедия, высмеивающая популярные ужастики и подростковые слэшеры конца девяностых.',
    releaseDate: '7 июля 2000',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Анна Фэрис',
        photo: '/static/images/cinema/actors/anna-faris.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Джон Абрахамс',
        photo: '/static/images/cinema/actors/jon-abrahams.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Марлон Уайанс',
        photo: '/static/images/cinema/actors/marlon-wayans.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Шон Уайанс',
        photo: '/static/images/cinema/actors/shawn-wayans.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Шэннон Элизабет',
        photo: '/static/images/cinema/actors/shannon-elizabeth.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Кинен Айвори Уайанс',
        photo: '/static/images/cinema/directors/keenen-ivory-wayans.webp'
      }
    ],
    runtime: 88,
    ageRating: Rating.R,
    genres: ['комедия', 'ужасы'],
    userRatings: {
      kinopoisk: '7.0',
      imdb: '6.3'
    },
    img: '/static/images/cinema/films/scary-movie.webp',
    country: {
      id: 8,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '9',
    name: 'Великий уравнитель',
    originalName: 'The Equalizer',
    description:
      'Бывший агент спецслужб пытается начать спокойную жизнь, но снова берётся за оружие, чтобы защитить беззащитных.',
    releaseDate: '7 сентября 2014',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Дензел Вашингтон',
        photo: '/static/images/cinema/actors/denzel-washington.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Мартон Чокаш',
        photo: '/static/images/cinema/actors/marton-csokas.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Хлоя Грейс Морец',
        photo: '/static/images/cinema/actors/chloe-grace-moretz.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Дэвид Харбор',
        photo: '/static/images/cinema/actors/david-harbour.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Билл Пуллман',
        photo: '/static/images/cinema/actors/bill-pullman.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Антуан Фукуа',
        photo: '/static/images/cinema/directors/antoine-fuqua.webp'
      }
    ],
    runtime: 132,
    ageRating: Rating.R,
    genres: ['боевик', 'триллер', 'криминал'],
    userRatings: {
      kinopoisk: '7.3',
      imdb: '7.2'
    },
    img: '/static/images/cinema/films/the-equalizer.webp',
    country: {
      id: 9,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '10',
    name: 'Сонная Лощина',
    originalName: 'Sleepy Hollow',
    description:
      'Констебль Икабод Крейн прибывает в деревню Сонная Лощина, где жители гибнут от рук загадочного всадника без головы.',
    releaseDate: '17 ноября 1999',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Джонни Депп',
        photo: '/static/images/cinema/actors/johnny-depp.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Кристина Риччи',
        photo: '/static/images/cinema/actors/christina-ricci.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Миранда Ричардсон',
        photo: '/static/images/cinema/actors/miranda-richardson.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Майкл Гэмбон',
        photo: '/static/images/cinema/actors/michael-gambon.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Кристофер Уокен',
        photo: '/static/images/cinema/actors/christopher-walken.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Тим Бёртон',
        photo: '/static/images/cinema/directors/tim-burton.webp'
      }
    ],
    runtime: 105,
    ageRating: Rating.R,
    genres: ['ужасы', 'фэнтези', 'детектив'],
    userRatings: {
      kinopoisk: '7.7',
      imdb: '7.3'
    },
    img: '/static/images/cinema/films/sleepy-hollow.webp',
    country: {
      id: 10,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '11',
    name: 'Назад в будущее',
    originalName: 'Back to the Future',
    description:
      'Подросток Марти Макфлай случайно отправляется в прошлое на машине времени и должен исправить ход событий, чтобы вернуться домой.',
    releaseDate: '3 июля 1985',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Майкл Джей Фокс',
        photo: '/static/images/cinema/actors/michael-j-fox.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Кристофер Ллойд',
        photo: '/static/images/cinema/actors/christopher-lloyd.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Лиа Томпсон',
        photo: '/static/images/cinema/actors/lea-thompson.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Криспин Гловер',
        photo: '/static/images/cinema/actors/crispin-glover.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Томас Ф. Уилсон',
        photo: '/static/images/cinema/actors/thomas-f-wilson.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Роберт Земекис',
        photo: '/static/images/cinema/directors/robert-zemeckis.webp'
      }
    ],
    runtime: 116,
    ageRating: Rating.PG,
    genres: ['фантастика', 'комедия', 'приключения'],
    userRatings: {
      kinopoisk: '8.6',
      imdb: '8.5'
    },
    img: '/static/images/cinema/films/back-to-the-future.webp',
    country: {
      id: 11,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '12',
    name: 'Сайлент Хилл',
    originalName: 'Silent Hill',
    description:
      'Мать отправляется в заброшенный город Сайлент Хилл, чтобы найти пропавшую дочь, и сталкивается с кошмарами, ожившими из тумана.',
    releaseDate: '21 апреля 2006',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Рада Митчелл',
        photo: '/static/images/cinema/actors/radha-mitchell.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Шон Бин',
        photo: '/static/images/cinema/actors/sean-bean.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Лори Холден',
        photo: '/static/images/cinema/actors/laurie-holden.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Дебора Кара Ангер',
        photo: '/static/images/cinema/actors/deborah-kara-unger.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Джодель Ферланд',
        photo: '/static/images/cinema/actors/jodelle-ferland.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Кристоф Ган',
        photo: '/static/images/cinema/directors/christophe-gans.webp'
      }
    ],
    runtime: 125,
    ageRating: Rating.R,
    genres: ['ужасы', 'детектив'],
    userRatings: {
      kinopoisk: '7.2',
      imdb: '6.5'
    },
    img: '/static/images/cinema/films/silent-hill.webp',
    country: {
      id: 12,
      code: 'CAN',
      code2: 'CA',
      name: 'Канада'
    }
  },
  {
    id: '13',
    name: 'Пятница 13-е',
    originalName: 'Friday the 13th',
    description:
      'Группа молодых людей приезжает в лагерь у Хрустального озера и сталкивается с кровавой легендой этого места.',
    releaseDate: '9 мая 1980',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Бетси Палмер',
        photo: '/static/images/cinema/actors/betsy-palmer.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Эдриэнн Кинг',
        photo: '/static/images/cinema/actors/adrienne-king.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Гарри Кросби',
        photo: '/static/images/cinema/actors/harry-crosby.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Лори Бартрам',
        photo: '/static/images/cinema/actors/laurie-bartram.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Кевин Бейкон',
        photo: '/static/images/cinema/actors/kevin-bacon.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Шон С. Каннингем',
        photo: '/static/images/cinema/directors/sean-s-cunningham.webp'
      }
    ],
    runtime: 95,
    ageRating: Rating.R,
    genres: ['ужасы', 'триллер'],
    userRatings: {
      kinopoisk: '6.3',
      imdb: '6.4'
    },
    img: '/static/images/cinema/films/friday-the-13th.webp',
    country: {
      id: 13,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '14',
    name: 'День сурка',
    originalName: 'Groundhog Day',
    description:
      'Телеведущий Фил Коннорс снова и снова проживает один и тот же день, постепенно меняя себя и своё отношение к жизни.',
    releaseDate: '12 февраля 1993',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Билл Мюррей',
        photo: '/static/images/cinema/actors/bill-murray.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Энди Макдауэлл',
        photo: '/static/images/cinema/actors/andie-macdowell.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Крис Эллиотт',
        photo: '/static/images/cinema/actors/chris-elliott.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Стивен Тоболовски',
        photo: '/static/images/cinema/actors/stephen-tobolowsky.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Брайан Дойл-Мюррей',
        photo: '/static/images/cinema/actors/brian-doyle-murray.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR, Profession.ACTOR],
        fullName: 'Гарольд Рамис',
        photo: '/static/images/cinema/directors/harold-ramis.webp'
      }
    ],
    runtime: 101,
    ageRating: Rating.PG,
    genres: ['комедия', 'фэнтези', 'мелодрама'],
    userRatings: {
      kinopoisk: '8.1',
      imdb: '8.0'
    },
    img: '/static/images/cinema/films/groundhog-day.webp',
    country: {
      id: 14,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '15',
    name: 'Чужой',
    originalName: 'Alien',
    description:
      'Экипаж космического буксира «Ностромо» принимает сигнал бедствия и сталкивается с неизвестной смертоносной формой жизни.',
    releaseDate: '25 мая 1979',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Сигурни Уивер',
        photo: '/static/images/cinema/actors/sigourney-weaver.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Том Скеррит',
        photo: '/static/images/cinema/actors/tom-skerritt.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Вероника Картрайт',
        photo: '/static/images/cinema/actors/veronica-cartwright.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Гарри Дин Стэнтон',
        photo: '/static/images/cinema/actors/harry-dean-stanton.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Иэн Холм',
        photo: '/static/images/cinema/actors/ian-holm.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Ридли Скотт',
        photo: '/static/images/cinema/directors/ridley-scott.webp'
      }
    ],
    runtime: 117,
    ageRating: Rating.R,
    genres: ['ужасы', 'фантастика', 'триллер'],
    userRatings: {
      kinopoisk: '8.1',
      imdb: '8.5'
    },
    img: '/static/images/cinema/films/alien.webp',
    country: {
      id: 15,
      code: 'GBR',
      code2: 'GB',
      name: 'Великобритания'
    }
  },
  {
    id: '16',
    name: 'Хэллоуин',
    originalName: 'Halloween',
    description:
      'Маньяк Майкл Майерс сбегает из лечебницы и возвращается в родной город, где начинает преследовать подростков.',
    releaseDate: '25 октября 1978',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Дональд Плезенс',
        photo: '/static/images/cinema/actors/donald-pleasence.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Джейми Ли Кёртис',
        photo: '/static/images/cinema/actors/jamie-lee-curtis.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Нэнси Кайс',
        photo: '/static/images/cinema/actors/nancy-kyes.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Пи Джей Соулс',
        photo: '/static/images/cinema/actors/pj-soles.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Ник Касл',
        photo: '/static/images/cinema/actors/nick-castle.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Джон Карпентер',
        photo: '/static/images/cinema/directors/john-carpenter.webp'
      }
    ],
    runtime: 91,
    ageRating: Rating.R,
    genres: ['ужасы', 'триллер'],
    userRatings: {
      kinopoisk: '7.1',
      imdb: '7.7'
    },
    img: '/static/images/cinema/films/halloween.webp',
    country: {
      id: 16,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '17',
    name: 'Техасская резня бензопилой',
    originalName: 'The Texas Chain Saw Massacre',
    description:
      'Компания друзей оказывается в техасской глубинке, где сталкивается с безумной семьёй и её самым страшным представителем.',
    releaseDate: '1 октября 1974',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Мэрилин Бёрнс',
        photo: '/static/images/cinema/actors/marilyn-burns.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Пол А. Партейн',
        photo: '/static/images/cinema/actors/paul-a-partain.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Эдвин Нил',
        photo: '/static/images/cinema/actors/edwin-neal.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Джим Сидоу',
        photo: '/static/images/cinema/actors/jim-siedow.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Гуннар Хансен',
        photo: '/static/images/cinema/actors/gunnar-hansen.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Тоуб Хупер',
        photo: '/static/images/cinema/directors/tobe-hooper.webp'
      }
    ],
    runtime: 83,
    ageRating: Rating.R,
    genres: ['ужасы'],
    userRatings: {
      kinopoisk: '6.7',
      imdb: '7.4'
    },
    img: '/static/images/cinema/films/the-texas-chain-saw-massacre.webp',
    country: {
      id: 17,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  },
  {
    id: '18',
    name: 'Мальчишник в Вегасе',
    originalName: 'The Hangover',
    description:
      'После бурной ночи в Лас-Вегасе трое друзей пытаются восстановить события вчерашнего вечера и найти пропавшего жениха.',
    releaseDate: '30 мая 2009',
    actors: [
      {
        id: '1',
        professions: [Profession.ACTOR],
        fullName: 'Брэдли Купер',
        photo: '/static/images/cinema/actors/bradley-cooper.webp'
      },
      {
        id: '2',
        professions: [Profession.ACTOR],
        fullName: 'Эд Хелмс',
        photo: '/static/images/cinema/actors/ed-helms.webp'
      },
      {
        id: '3',
        professions: [Profession.ACTOR],
        fullName: 'Зак Галифианакис',
        photo: '/static/images/cinema/actors/zach-galifianakis.webp'
      },
      {
        id: '4',
        professions: [Profession.ACTOR],
        fullName: 'Джастин Барта',
        photo: '/static/images/cinema/actors/justin-bartha.webp'
      },
      {
        id: '5',
        professions: [Profession.ACTOR],
        fullName: 'Хизер Грэм',
        photo: '/static/images/cinema/actors/heather-graham.webp'
      }
    ],
    directors: [
      {
        id: '1',
        professions: [Profession.DIRECTOR],
        fullName: 'Тодд Филлипс',
        photo: '/static/images/cinema/directors/todd-phillips.webp'
      }
    ],
    runtime: 100,
    ageRating: Rating.R,
    genres: ['комедия'],
    userRatings: {
      kinopoisk: '7.8',
      imdb: '7.7'
    },
    img: '/static/images/cinema/films/the-hangover.webp',
    country: {
      id: 18,
      code: 'USA',
      code2: 'US',
      name: 'США'
    }
  }
];
