import { Request, Response, Router } from 'express';
import { OrderRepository } from '../models/Order';
import { OrderType } from '../interfaces/Order';
import { authToken } from '../middlewares/auth';
import { OrderResponseDTO } from '../interfaces/dtos/OrderResponseDTO';

const orderRouter: Router = Router();
const orderModel: OrderRepository = new OrderRepository();

orderRouter.get('/:user_id', authToken, async (req: Request, res: Response) => {
  try {
    const userId: number = parseInt(req.params.user_id);
    const currentOrder: OrderResponseDTO[] =
      await orderModel.getAllOrdersByUserId(userId);
    return res.json(currentOrder);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

orderRouter.get(
  '/current/:user_id',
  authToken,
  async (req: Request, res: Response) => {
    try {
      const userId: number = parseInt(req.params.user_id);
      const currentOrder: OrderResponseDTO =
        await orderModel.getCurrentOrderByUserId(userId);
      return res.json(currentOrder);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

orderRouter.get(
  '/active/:user_id',
  authToken,
  async (req: Request, res: Response) => {
    try {
      const userId: number = parseInt(req.params.user_id);
      const activeOrder: OrderResponseDTO[] =
        await orderModel.getActiveOrdersByUserId(userId);
      return res.json(activeOrder);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

orderRouter.get(
  '/completed/:user_id',
  authToken,
  async (req: Request, res: Response) => {
    try {
      const userId: number = parseInt(req.params.user_id);
      const completedOrder: OrderResponseDTO[] =
        await orderModel.getCompletedOrdersByUserId(userId);
      return res.json(completedOrder);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

orderRouter.put('/', authToken, async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const orderId = parseInt(req.query.orderId as string);

    if (orderId && ['active', 'complete'].includes(status)) {
      const updatedOrder: OrderResponseDTO = await orderModel.updateOrderStatus(
        status,
        orderId,
      );
      return res.json(updatedOrder);
    } else {
      return res.status(400).json({ error: 'Bad parameters' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

orderRouter.delete('/:id', authToken, async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const deletedOrder: OrderResponseDTO = await orderModel.deleteOrder(id);
    return res.json(deletedOrder);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

orderRouter.post('/', authToken, async (req: Request, res: Response) => {
  try {
    const newOrder: OrderType = await orderModel.createOrder(req.body);
    return res.json(newOrder);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default orderRouter;
