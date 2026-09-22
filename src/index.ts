import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './auth/auth.controller.js';
import { errorHandler } from './middleware/error-handler.js';
import { watchlistRouter } from './watchlist/watchlist.controller.js';
import { verifyToken } from './middleware/authMiddleware.js';

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
  }),
);
app.use(express.json());

app.use('/api', authRouter);
app.use('/user',watchlistRouter)
app.get('/api/me', verifyToken, (req, res) => {
  res.json({ message: 'Authorized access', userEmail: req.userId });
});
app.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'serial-tracker-backend' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
