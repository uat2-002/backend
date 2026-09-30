import {
  addSeriesToUser,
  deleteSeriesFromUser,
  getUserSeriesIds,
  updateUserSeriesStatus,
  getUserSeriesById,
} from './watchlist.repository.js';

export async function addSeries(userEmail: string, tmdbId: number) {
  return await addSeriesToUser(userEmail, tmdbId);
}

export async function updateUserStatus(
  userEmail: string,
  seriesId: number,
  userStatus: 'plan_to_watch' | 'watching' | 'watched' | 'not_worth_it',
) {
  return await updateUserSeriesStatus(userEmail, seriesId, userStatus);
}

export async function deleteSeries(userEmail: string, seriesId: number) {
  return await deleteSeriesFromUser(userEmail, seriesId);
}

export const fetchUserSeriesStatus = async (userEmail: string, seriesId: number) => {
  const userSeries = await getUserSeriesById(userEmail, seriesId);

  if (!userSeries) {
    return { userStatus: 'none' };
  }

  return {
    seriesId: userSeries.seriesId,
    userStatus: userSeries.userStatus,
  };
};
export async function getUserSeries(userEmail: string): Promise<number[]> {
  const userSeries = await getUserSeriesIds(userEmail);
  return userSeries.map((item) => item.seriesId);
}
