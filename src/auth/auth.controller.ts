import { Router } from 'express';
import { registerUser } from './auth.service.js';
import { registerSchema } from './auth.schema.js';
import { validate } from '../middleware/validate.js';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await registerUser(email, password);
  res.status(201).json(user);
});
