import z from 'zod';

export const UpdateSeriesStatusSchema = z.object({
  seriesId: z.number(),
  status: z.enum(['plan_to_watch', 'watching', 'watched', 'not_worth_it']),
});

export const UpdateEpisodeSchema = z.object({
  seriesId: z.number(),
  episodeId: z.number(),
  isWatched: z.boolean(),
});

export type UpdateSeriesStatusSchema = z.infer<typeof UpdateSeriesStatusSchema>;
export type UpdateEpisodeSchema = z.infer<typeof UpdateEpisodeSchema>;
