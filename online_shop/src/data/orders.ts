export interface OrderItem {
  productId: number;
  title: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: number;
  date: string;
  total: number;
  status: 'zrealizowane' | 'w trakcie' | 'anulowane';
  items: OrderItem[];
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 101,
    date: '2023-11-15',
    total: 159.98,
    status: 'zrealizowane',
    items: [
      { productId: 1, title: "Fjallraven Backpack", quantity: 1, price: 109.95, image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" },
      { productId: 2, title: "Mens Casual T-Shirt", quantity: 2, price: 22.3, image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg" }
    ]
  },
  {
    id: 102,
    date: '2023-12-05',
    total: 55.99,
    status: 'w trakcie',
    items: [
      { productId: 3, title: "Mens Cotton Jacket", quantity: 1, price: 55.99, image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg" }
    ]
  }
];