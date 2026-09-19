import * as z from "zod";

export const addSeriesSchema = z.object({
    tmdbId: z.number().int().positive('TMDB ID must be positive number'),
});