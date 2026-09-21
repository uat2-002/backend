import 'dotenv/config';
import express from 'express';
import { authRouter } from './auth/auth.controller.js';
import { errorHandler } from './middleware/error-handler.js';
import { watchlistRouter } from './watchlist/watchlist.controller.js';
import { verifyToken } from './middleware/authMiddleware.js';

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();

app.use(express.json());

app.use((_request, response, next) => {
  response.header('Access-Control-Allow-Origin', FRONTEND_URL);
  response.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api', authRouter);
app.use('/user',watchlistRouter)
app.get('/api/me', verifyToken, (req, res) => {
  res.json({ message: 'Authorized access', userEmail: (req as any).userId });
});
app.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'serial-tracker-backend' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
