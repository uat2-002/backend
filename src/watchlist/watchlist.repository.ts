import { prisma } from '../prisma-client.js';

export async function addSeriesToUser(userEmail: string, tmdbId: number) {
  return prisma.userSeries.create({
    data: {
      userEmail: userEmail,
      seriesId: tmdbId,
    },
  });
}

export async function updateUserSeriesStatus(
  userEmail: string,
  seriesId: number,
  userStatus: 'plan_to_watch' | 'watching' | 'watched' | 'not_worth_it',
) {
  return prisma.userSeries.update({
    where: {
      userEmail_seriesId: {
        userEmail,
        seriesId,
      },
    },
    data: {
      userStatus,
    },
  });
}

export async function deleteSeriesFromUser(userEmail: string, seriesId: number) {
  const [_deletedEpisodes, deletedSeries] = await prisma.$transaction([
    prisma.userEpisode.deleteMany({
      where: {
        userEmail,
        episode: {
          seriesId,
        },
      },
    }),
    prisma.userSeries.delete({
      where: {
        userEmail_seriesId: {
          userEmail,
          seriesId,
        },
      },
    }),
  ]);

  return deletedSeries;
}

export const getUserSeriesById = async (userEmail: string, seriesId: number) => {
  return await prisma.userSeries.findUnique({
    where: {
      userEmail_seriesId: {
        userEmail,
        seriesId,
      },
    },
  });
};
export async function getUserSeriesIds(userEmail: string) {
  return prisma.userSeries.findMany({
    where: {
      userEmail,
    },
    select: {
      seriesId: true,
    },
  });
}

export async function findUserSeriesWithDetails(userEmail: string) {
  return prisma.userSeries.findMany({
    where: {
      userEmail,
    },
    include: {
      series: true,
    },
    orderBy: {
      dateAdded: 'desc',
    },
  });
}
