import type { Dish, Order, Customer } from '../types'
export { BUSINESS } from '../config/business'

export const DISHES: Dish[] = [
  {
    id: 'd01',
    name: 'Pollo a la plancha con yuca',
    description: 'Pechuga grillada, yuca y aguacate con ajonjolí',
    price: 350,
    image: '/dishes/plato-01.webp',
  },
  {
    id: 'd02',
    name: 'Pollo con puré y ensalada',
    description: 'Pollo grillado, puré, pepino, tomate y aguacate',
    price: 350,
    image: '/dishes/plato-02.webp',
  },
  {
    id: 'd03',
    name: 'Huevos con queso a la plancha',
    description: 'Huevos, queso grillado, puré de auyama y aguacate',
    price: 320,
    image: '/dishes/plato-03.webp',
  },
  {
    id: 'd04',
    name: 'Pescado a la plancha con yuca',
    description: 'Filete de pescado, yuca, aguacate y ensalada',
    price: 380,
    image: '/dishes/plato-04.webp',
  },
  {
    id: 'd05',
    name: 'Chuleta de cerdo grillada',
    description: 'Chuleta, puré, ensalada de lechuga y zanahoria',
    price: 380,
    image: '/dishes/plato-05.webp',
  },
  {
    id: 'd06',
    name: 'Costillas con puré de auyama',
    description: 'Costillas a la parrilla, aguacate y ensalada fresca',
    price: 400,
    image: '/dishes/plato-06.webp',
  },
  {
    id: 'd07',
    name: 'Pollo asado con víveres',
    description: 'Pollo asado, huevo, vegetales cocidos y aguacate',
    price: 370,
    image: '/dishes/plato-07.webp',
  },
  {
    id: 'd08',
    name: 'Carne molida con vegetales',
    description: 'Carne molida, huevo, vegetales al vapor y puré',
    price: 350,
    image: '/dishes/plato-08.webp',
  },
  {
    id: 'd09',
    name: 'Chuleta T-bone con puré',
    description: 'Chuleta, aguacate, huevo, zanahoria y yuca',
    price: 420,
    image: '/dishes/plato-09.webp',
  },
  {
    id: 'd10',
    name: 'Filete de pescado con arroz',
    description: 'Pescado grillado, arroz, aguacate y ensalada',
    price: 380,
    image: '/dishes/plato-10.webp',
  },
  {
    id: 'd11',
    name: 'Albóndigas con vegetales',
    description: 'Albóndigas, aguacate, huevo, vegetales y puré',
    price: 360,
    image: '/dishes/plato-11.webp',
  },
  {
    id: 'd12',
    name: 'Carne a la plancha con auyama',
    description: 'Carne grillada, puré de auyama, queso y aguacate',
    price: 390,
    image: '/dishes/plato-12.webp',
  },
]

const today = () => {
  const d = new Date()
  d.setHours(10, 30, 0, 0)
  return d
}

const hoursAgo = (h: number, m = 0) => {
  const d = today()
  d.setHours(d.getHours() - h, m)
  return d.toISOString()
}

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1042',
    customerName: 'María Rodríguez',
    customerPhone: '8095551234',
    address: 'Calle del Sol 45, Centro, Santiago',
    items: [
      { dishId: 'd01', name: 'Pollo a la plancha con yuca', price: 350, quantity: 2 },
    ],
    paymentMethod: 'efectivo',
    notes: 'Sin ajonjolí en el aguacate',
    status: 'listo_entrega',
    createdAt: hoursAgo(3, 15),
    total: 700,
  },
  {
    id: 'ORD-1041',
    customerName: 'Carlos Pérez',
    customerPhone: '8295559876',
    address: 'Av. Estrella Sadhalá 120, Villa Olga',
    items: [
      { dishId: 'd04', name: 'Pescado a la plancha con yuca', price: 380, quantity: 1 },
      { dishId: 'd03', name: 'Huevos con queso a la plancha', price: 320, quantity: 1 },
    ],
    paymentMethod: 'transferencia',
    notes: '',
    status: 'en_preparacion',
    createdAt: hoursAgo(2, 40),
    total: 700,
  },
  {
    id: 'ORD-1040',
    customerName: 'Ana Gómez',
    customerPhone: '8495554321',
    address: 'Residencial La Rosaleda, Torre B apto 4B',
    items: [
      { dishId: 'd07', name: 'Pollo asado con víveres', price: 370, quantity: 1 },
    ],
    paymentMethod: 'efectivo',
    notes: 'Llamar al llegar al portón',
    status: 'pendiente',
    createdAt: hoursAgo(1, 5),
    total: 370,
  },
  {
    id: 'ORD-1039',
    customerName: 'Luis Méndez',
    customerPhone: '8095557788',
    address: 'Calle Restauración 88, Los Jardines',
    items: [
      { dishId: 'd06', name: 'Costillas con puré de auyama', price: 400, quantity: 2 },
    ],
    paymentMethod: 'efectivo',
    notes: '',
    status: 'listo_entrega',
    createdAt: hoursAgo(4, 20),
    total: 800,
  },
  {
    id: 'ORD-1038',
    customerName: 'Patricia Núñez',
    customerPhone: '8295553344',
    address: 'Plaza Internacional, local 12 (oficina)',
    items: [
      { dishId: 'd10', name: 'Filete de pescado con arroz', price: 380, quantity: 1 },
      { dishId: 'd02', name: 'Pollo con puré y ensalada', price: 350, quantity: 1 },
    ],
    paymentMethod: 'transferencia',
    notes: 'Delivery a la recepción',
    status: 'entregado',
    createdAt: hoursAgo(5, 50),
    total: 730,
  },
  {
    id: 'ORD-1037',
    customerName: 'José Castillo',
    customerPhone: '8495552211',
    address: 'Calle 14 #22, Gurabo',
    items: [
      { dishId: 'd11', name: 'Albóndigas con vegetales', price: 360, quantity: 1 },
    ],
    paymentMethod: 'efectivo',
    notes: '',
    status: 'entregado',
    createdAt: hoursAgo(6, 10),
    total: 360,
  },
]

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'María Rodríguez',
    phone: '8095551234',
    lastAddress: 'Calle del Sol 45, Centro, Santiago',
    lastOrderAt: hoursAgo(3, 15),
    orderCount: 8,
  },
  {
    id: 'c2',
    name: 'Carlos Pérez',
    phone: '8295559876',
    lastAddress: 'Av. Estrella Sadhalá 120, Villa Olga',
    lastOrderAt: hoursAgo(2, 40),
    orderCount: 5,
  },
  {
    id: 'c3',
    name: 'Ana Gómez',
    phone: '8495554321',
    lastAddress: 'Residencial La Rosaleda, Torre B apto 4B',
    lastOrderAt: hoursAgo(1, 5),
    orderCount: 12,
  },
  {
    id: 'c4',
    name: 'Luis Méndez',
    phone: '8095557788',
    lastAddress: 'Calle Restauración 88, Los Jardines',
    lastOrderAt: hoursAgo(4, 20),
    orderCount: 3,
  },
  {
    id: 'c5',
    name: 'Patricia Núñez',
    phone: '8295553344',
    lastAddress: 'Plaza Internacional, local 12 (oficina)',
    lastOrderAt: hoursAgo(5, 50),
    orderCount: 6,
  },
  {
    id: 'c6',
    name: 'José Castillo',
    phone: '8495552211',
    lastAddress: 'Calle 14 #22, Gurabo',
    lastOrderAt: hoursAgo(6, 10),
    orderCount: 2,
  },
]
