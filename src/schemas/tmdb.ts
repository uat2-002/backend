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
  poster_path: z.string().optional(),
  backdrop_path: z.string().optional(),
  overview: z.string().optional(),
  first_air_date: z.string().optional(),
  number_of_seasons: z.number().optional(),
  number_of_episodes: z.number().optional(),
  status: z.string(),
});
export type TmdbSeriesResponseSchema = z.infer<typeof TmdbSeriesSchema>;
export type TmdbEpisodeResponseSchema = z.infer<typeof TmdbEpisodeSchema>;
