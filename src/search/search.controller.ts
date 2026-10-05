import { Router } from 'express';
import { searchSeries } from './search.service.js';

export const searchRouter = Router();

searchRouter.get("/series", async (req, res, next) => { 
    try {
    const query = req.query.query as string;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    if (!query || query.trim() === '') {
      return res.status(200).json({ results: [], 
    message: "Search query is required" });
    }
        const data = await searchSeries(query.trim(), page);
        if (data.results && data.results.length === 0) {
      return res.status(200).json({
        ...data,
        message: "No results found for your search" 
      });
    }
    res.status(200).json(data);
  } catch (error) {
    next(error); 
  }
});