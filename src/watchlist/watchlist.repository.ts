import { prisma } from '../prisma-client.js';

export async function addSeriesToUser(userEmail: string, tmdbId: number) { 
    return prisma.userSeries.create({
        data: {
            userEmail: userEmail,
            seriesId: tmdbId
        }
    });
};

export async function updateUserSeriesStatus(userEmail: string, seriesId:number, userStatus:"plan_to_watch"|"watching"|"watched"|"not_worth_it") { 
    return prisma.userSeries.update({
        where: {userEmail_seriesId: {
                userEmail,
                seriesId
            }},
        data: {
            userStatus
        }
    });
};