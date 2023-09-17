import { OrderProductType } from './OrderProducts';

export interface OrderType {
  user_id: number;
  status: string;
  orderProducts: OrderProductType[];
}
