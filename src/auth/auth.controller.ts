import { Router } from 'express';
import { registerUser,loginUser } from './auth.service.js';
import { registerSchema } from './auth.schema.js';
import { validate } from '../middleware/validate.js';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await registerUser(email, password);
  res.status(201).json(user);
});

authRouter.post('/login', validate(registerSchema), async (req, res,next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(result);
   }
  catch (error) {
    next(error);
   }
});