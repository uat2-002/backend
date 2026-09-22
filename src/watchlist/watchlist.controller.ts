import { Router } from 'express';
import { addSeriesSchema } from './watchlist.schema.js';
import { addSeries } from './watchlist.service.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { HttpError } from '../errors/http-error.js';

export const watchlistRouter = Router();
watchlistRouter.post('/series', verifyToken, validate(addSeriesSchema), async (req, res, next) => {
    try {
        const userEmail = req.userId;
         if (!userEmail) {
              throw new HttpError(401, 'Unauthorized access');
            }
        const { tmdbId } = req.body;
        const userSeries = await addSeries(userEmail, tmdbId);
        res.status(200).json({
        userSeriesId: userSeries.userEmail, 
        message: 'series was added successfully'
      });

    } catch(error) { 
next(error);
    }
 })