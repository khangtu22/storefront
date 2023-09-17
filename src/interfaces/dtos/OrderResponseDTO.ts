import { OrderProductResponseDTO } from './OrderProductResponseDTO';

export interface OrderResponseDTO {
  id: number;
  user_id: number;
  status: string;
  orderProducts: OrderProductResponseDTO[];
}
