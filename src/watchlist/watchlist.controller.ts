import { Router } from 'express';
import { addSeriesSchema, updateUserStatusSchema } from './watchlist.schema.js';
import {
  addSeries,
  deleteSeries,
  updateUserStatus,
  fetchUserSeriesStatus,
  getUserSeries,
  getUserSeriesWithDetails,
} from './watchlist.service.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { HttpError } from '../errors/http-error.js';

export const watchlistRouter = Router();

watchlistRouter.get('/series', verifyToken, async (req, res) => {
  const userEmail = req.userId;
  if (!userEmail) {
    throw new HttpError(401, 'Unauthorized access');
  }
  const tmdbIds = await getUserSeries(userEmail);
  res.status(200).json({ tmdbIds });
});

watchlistRouter.post('/series', verifyToken, validate(addSeriesSchema), async (req, res) => {
  const userEmail = req.userId;
  if (!userEmail) {
    throw new HttpError(401, 'Unauthorized access');
  }
  const { tmdbId } = req.body;
  const userSeries = await addSeries(userEmail, tmdbId);
  res.status(200).json({
    userSeriesId: userSeries.userEmail,
    message: 'series was added successfully',
  });
});

watchlistRouter.patch(
  '/series/:seriesId',
  verifyToken,
  validate(updateUserStatusSchema),
  async (req, res) => {
    const userEmail = req.userId;
    if (!userEmail) {
      throw new HttpError(401, 'Unauthorized access');
    }
    const seriesId = Number(req.params.seriesId);
    if (isNaN(seriesId) || !Number.isInteger(seriesId) || seriesId <= 0) {
      throw new HttpError(400, 'Invalid series ID format. Must be a positive integer.');
    }
    const { userStatus } = req.body;
    const updatedRecord = await updateUserStatus(userEmail, seriesId, userStatus);
    res.status(200).json({
      seriesId: updatedRecord.seriesId,
      userStatus: updatedRecord.userStatus,
      message: 'series status was updated successfully',
    });
  },
);

watchlistRouter.delete('/series/:seriesId', verifyToken, async (req, res) => {
  const userEmail = req.userId;
  if (!userEmail) {
    throw new HttpError(401, 'Unauthorized access');
  }
  const seriesId = Number(req.params.seriesId);
  if (isNaN(seriesId) || !Number.isInteger(seriesId) || seriesId <= 0) {
    throw new HttpError(400, 'Invalid series ID format. Must be a positive integer.');
  }
  await deleteSeries(userEmail, seriesId);
  res.status(200).json({
    message: 'series was removed successfully',
  });
});

watchlistRouter.get('/series/:seriesId', verifyToken, async (req, res) => {
  const userEmail = req.userId;

  if (!userEmail) {
    throw new HttpError(401, 'Unauthorized');
  }

  const seriesId = Number(req.params.seriesId);

  if (isNaN(seriesId) || seriesId <= 0) {
    throw new HttpError(400, 'Invalid series ID');
  }

  const result = await fetchUserSeriesStatus(userEmail, seriesId);

  res.status(200).json(result);
});

watchlistRouter.get('/series-data', verifyToken, async (req, res) => {
  const userEmail = req.userId;

  if (!userEmail) {
    throw new HttpError(401, 'Unauthorized access');
  }

  const series = await getUserSeriesWithDetails(userEmail);

  res.status(200).json({ series });
});
