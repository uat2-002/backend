import { Router } from 'express';
import { registerUser,loginUser,refreshSession,logoutUser} from './auth.service.js';
import { registerSchema } from './auth.schema.js';
import { validate } from '../middleware/validate.js';
import { HttpError } from '../errors/http-error.js';
import { verifyToken } from '../middleware/authMiddleware.js';

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

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new HttpError(401, 'Refresh token required');
    }
    
    const result = await refreshSession(refreshToken);
    res.status(200).json(result); 
  } catch (error) {
    next(error);
  }
});

authRouter.post('/logout', verifyToken, async (req, res, next) => {
  try {
    const userEmail = req.userId;
    
    if (!userEmail) {
      throw new HttpError(401, 'Unauthorized');
    }

    await logoutUser(userEmail);
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});