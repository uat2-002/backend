import { addSeriesToUser } from "./watchlist.repository.js";
import { HttpError } from "../errors/http-error.js";

export async function addSeries(userEmail:string,tmdbId:number) {
    try {
        return await addSeriesToUser(userEmail, tmdbId);
    }
    catch(err:any) { 
    if (err.code === 'P2002') {
      throw new HttpError(409, 'This serial is already in your list');
    }
    if (err.code === 'P2003') {
      throw new HttpError(404, 'User or Series not found in database');
    }
      throw err;
    }
 }