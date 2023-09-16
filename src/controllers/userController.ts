import { Request, Response, Router } from 'express';
import { UserRepository } from '../models/User';
import { authToken } from '../middlewares/auth';
import { UserResponseDTO } from '../interfaces/dtos/UserResponseDTO';
import { UserCreatedResponseDTO } from '../interfaces/dtos/UserCreatedResponseDTO';

const userRouter: Router = Router();
const userModel: UserRepository = new UserRepository();

userRouter.get('/', authToken, async (_: Request, res: Response) => {
  try {
    const allUsers: UserResponseDTO[] = await userModel.getAllUsers();
    return res.json(allUsers);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

userRouter.get('/:id', authToken, async (req: Request, res: Response) => {
  try {
    const userId: number = parseInt(req.params.id);
    const user: UserResponseDTO = await userModel.getUserById(userId);
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

userRouter.post('/', authToken, async (req: Request, res: Response) => {
  try {
    const newUser: UserCreatedResponseDTO = await userModel.createUser(
      req.body,
    );
    return res.json(newUser);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

userRouter.delete('/:id', authToken, async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const deletedUser: UserResponseDTO = await userModel.deleteUser(id);
    return res.json(deletedUser);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default userRouter;
