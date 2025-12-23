
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  tags?: ('new' | 'sale' | 'best-seller')[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  level: '一般會員' | '銀卡會員' | '金卡會員' | '鑽石會員';
  points: number;
  avatar?: string;
  favorites: number[];
  tryOnPhotos: string[]; // Array of base64 strings
  isGoogleLinked?: boolean;
}

export enum ViewState {
  HOME = 'HOME',
  SHOP = 'SHOP',
  USER_PROFILE = 'USER_PROFILE',
  ORDER_SUCCESS = 'ORDER_SUCCESS',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percent' | 'fixed';
  value: number; // 0.9 for 10% off, or 100 for $100 off
  minSpend: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export type OrderStatus = '處理中' | '已出貨' | '已完成' | '已取消';
export type RefundStatus = '無' | '審核中' | '已退款' | '已拒絕';

export interface RefundInfo {
  reasonType: string;
  description: string;
  images?: string[]; // base64 or url
  date: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  discount?: number;
  refundStatus: RefundStatus;
  refundInfo?: RefundInfo;
  shippingMethod?: ShippingOption;
  shippingCost?: number;
}
