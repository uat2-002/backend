import * as z from "zod";

export const addSeriesSchema = z.object({
    tmdbId: z.number().int().positive('TMDB ID must be positive number'),
});

export const updateUserStatusSchema = z.object({
   userStatus:z.enum(["plan_to_watch","watching","watched","not_worth_it"])
});