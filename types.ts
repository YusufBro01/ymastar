
export type View = 'splash' | 'main' | 'profile' | 'buy' | 'premium' | 'orderSuccess';

export interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

export interface StarPackage {
  stars: number;
  price: number;
  priceFormatted: string;
}

export interface PremiumPackage {
  duration: string;
  price: string;
  monthlyPrice?: string;
}

export interface OrderDetails {
  recipient: User;
  stars: number;
  priceFormatted: string;
  paymentMethod: 'payme' | 'click';
}