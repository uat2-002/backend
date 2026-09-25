import { Router, type Request, type Response } from 'express';
import { SeriesDetailsResponseSchema } from './series.schema.js';
import { getOrSyncSeries, makeSeriesPayload } from './series.service.js';
import { validate } from '../middleware/validate.js';
import { getSeries, parseMaxAge } from '../parser/series.js';

export const seriesRouter = Router();

seriesRouter.get('/series/:id', async (req: Request, res: Response) => {
  if (req.params.id) {
    const seriesId = Number(req.params.id);

    let seriesDetails = await getOrSyncSeries(seriesId);

    const seriesPayload = makeSeriesPayload(seriesDetails);
    res.status(200).json(seriesPayload);
  }
});

// TODO:
// 1. Need to provide Zod Schemas for this route instead of interfaces
// 2. Move helping methods to this folder instead of importing from parser folder
// 3. Update cache logic and provide it here too.
seriesRouter.get('/series', async (request: Request, response: Response): Promise<void> => {
  const maxAgeMs = parseMaxAge(request.query.maxAge);
  try {
    response.json(await getSeries(maxAgeMs));
  } catch (error) {
    response
      .status(502)
      .json({ error: 'Failed to fetch series from TMDb', details: (error as Error).message });
  }
});
