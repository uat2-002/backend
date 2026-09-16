import { Router } from 'express';
import { registerUser } from './auth.service.js';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const user = await registerUser(email, password);
  res.status(201).json(user);
});
