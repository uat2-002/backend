import { prisma } from '../prisma-client.js';
import { mapTmdbStatus } from '../parser/tmdb-helpers.js';
import type { TmdbSeriesResponseSchema, TmdbSeasonWithEpisodesSchema } from './series.schema.js';

export const findSeriesDetails = async (seriesId: number) => {
  const series = await prisma.series.findUnique({
    where: {
      tmdbId: seriesId,
    },
    include: {
      seasons: {
        orderBy: {
          seasonNumber: 'asc',
        },
      },
    },
  });
  return series;
};
export const findSeasonDetails = async (seriesId: number, seasonNumber: number) => {
  const season = await prisma.season.findFirst({
    where: {
      seriesId: seriesId,
      seasonNumber: seasonNumber,
    },
    include: {
      episodes: {
        orderBy: {
          episodeNum: 'asc',
        },
      },
    },
  });
  return season;
};

export const createSeries = async (parsedSeries: TmdbSeriesResponseSchema) => {
  return await prisma.series.create({
    data: {
      tmdbId: parsedSeries.id,
      title: parsedSeries.name,
      backdrop: parsedSeries.backdrop_path,
      firstAirDate: parsedSeries.first_air_date ? new Date(parsedSeries.first_air_date) : null,
      numberOfEpisodes: parsedSeries.number_of_episodes,
      numberOfSeasons: parsedSeries.number_of_seasons,
      overview: parsedSeries.overview,
      poster: parsedSeries.poster_path,
      status: mapTmdbStatus(parsedSeries.status),

      seasons: {
        create: parsedSeries.seasons
          .filter(s => s.season_number > 0)
          .map(s => ({
            tmdbId: s.id,
            seasonNumber: s.season_number,
            name: s.name,
            overview: s.overview,
            poster: s.poster_path,
          })),
      },
    },
    include: {
      seasons: {
        orderBy: {
          seasonNumber: 'asc',
        },
      },
    },
  });
};

export const createSeasonWithEpisodes = async (
  parsedSeason: TmdbSeasonWithEpisodesSchema,
  seriesId: number
) => {
  return await prisma.episode.createMany({
    data: parsedSeason.episodes.map(ep => ({
      tmdbId: ep.id,
      seriesId: seriesId,
      seasonId: parsedSeason.id,
      seasonNumber: parsedSeason.season_number,
      episodeNum: ep.episode_number,
      title: ep.name,
      overview: ep.overview,
      stillPath: ep.still_path,
      airDate: ep.air_date ? new Date(ep.air_date) : null,
    })),
    skipDuplicates: true,
  });
};
