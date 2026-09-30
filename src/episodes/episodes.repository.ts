import { prisma } from '../prisma-client.js';

export const getEpisode = async (episodeId: number, userEmail: string) => {
  return await prisma.episode.findUnique({
    where: {
      tmdbId: episodeId,
    },
    include: {
      watchedBy: {
        where: {
          userEmail: userEmail,
        },
      },
    },
  });
};

export const toggleEpisodeWatched = async (
  userEmail: string,
  episodeId: number,
  seriesId: number
) => {
  return await prisma.$transaction([
    prisma.userEpisode.create({
      data: {
        userEmail,
        episodeId,
      },
    }),
    prisma.userSeries.upsert({
      where: {
        userEmail_seriesId: {
          userEmail,
          seriesId: seriesId,
        },
      },
      create: {
        userEmail,
        seriesId,
        watchedEpisodesCount: 1,
        userStatus: 'watching',
      },
      update: {
        watchedEpisodesCount: {
          increment: 1,
        },
        userStatus: 'watching',
      },
    }),
  ]);
};
export const toggleEpisodeUnwatched = async (
  userEmail: string,
  episodeId: number,
  seriesId: number
) => {
  return await prisma.$transaction([
    prisma.userEpisode.delete({
      where: {
        userEmail_episodeId: {
          userEmail,
          episodeId,
        },
      },
    }),
    prisma.userSeries.update({
      where: {
        userEmail_seriesId: {
          userEmail,
          seriesId: seriesId,
        },
      },
      data: {
        watchedEpisodesCount: {
          decrement: 1,
        },
      },
    }),
  ]);
};
