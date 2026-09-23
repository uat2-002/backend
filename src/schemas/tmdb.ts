import z from 'zod';

export const TmdbEpisodeSchema = z.object({
  id: z.number(),
  season_number: z.number(),
  episode_number: z.number(),
  title: z.string(),
  overview: z.string().optional(),
  still_path: z.string().optional(),
  air_date: z.string().optional(),
});

export const TmdbSeriesSchema = z.object({
    id: z.number(),
    title: z.string(),
    posterPath: z.string().optional(),
    backdropPath: z.string().optional(),
    overview: z.string().optional(),
    firstAirDate: z.string().optional(),
    numberOfSeasons: z.number().optional(),
    numberOfEpisodes: z.number().optional(),
    status: z.string(),
});