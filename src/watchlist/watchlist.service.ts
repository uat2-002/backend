import { addSeriesToUser,updateUserSeriesStatus } from "./watchlist.repository.js";
import { HttpError } from "../errors/http-error.js";

export async function addSeries(userEmail:string,tmdbId:number) {
    try {
        return await addSeriesToUser(userEmail, tmdbId);
    }
   catch (error) {
    const err = error as { code?: string };
    if (err.code === 'P2002') {
      throw new HttpError(409, 'This serial is already in your list');
    }
    if (err.code === 'P2003') {
      throw new HttpError(404, 'User or Series not found in database');
    }
        throw error;
  }
};

export async function updateUserStatus(userEmail:string,seriesId:number,userStatus:"plan_to_watch"|"watching"|"watched"|"not_worth_it") { 
  try {
    return await updateUserSeriesStatus(userEmail, seriesId, userStatus);
   } catch (error) {
    const err = error as { code?: string };
    if (err.code === 'P2025') {
            throw new HttpError(404, 'Series not found in your watchlist');
        }
    throw error;
   }
};