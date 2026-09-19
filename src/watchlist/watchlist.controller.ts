import { Router } from 'express';
import { addSeriesSchema } from './watchlist.schema.js';
import { addSeries } from './watchlist.service.js';
import { validate } from '../middleware/validate.js';

//blocked until JWT tokens will be done 
export const watchlistRouter = Router();
watchlistRouter.post('/series', mockAuthMiddleware, validate(addSeriesSchema), async (req, res, next) => {
    try {
        const userEmail = req.user.email;
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