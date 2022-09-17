import express from 'express';
import { PrismaClient } from '@prisma/client';
import { convertHoursStringToMinutes } from '../utils/convert-hours-string-to-minutes';
import { convertMinutesToHourString } from '../utils/convert-minutes-to-hours-string';

const appRouter = express.Router();
const prisma = new PrismaClient();

appRouter.get('/games', async (req, res) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    });

    return res.json(games);
});

appRouter.post('/games/:id/ads', (req, res) => {
    const gameId = req.params.id;

    const body = req.body;

    // Validação

    const ad = prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(","),
            hourStart: convertHoursStringToMinutes(body.hourStart),
            hourEnd: convertHoursStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    });


    return res.status(201).json(ad);
});

appRouter.get('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },

        where: {
            gameId,
        },

        orderBy: {
            createdAt: 'desc',
        }
    });

    return res.json(
        ads.map((ad) => {
            return {
                ...ad,
                weekDays: ad.weekDays.split(","),
                hourStart: convertMinutesToHourString(ad.hourStart),
                hourEnd: convertMinutesToHourString(ad.hourEnd),
            }
        })
    );
});

appRouter.get('/ads/:id/discord', async (req, res) => {
    const adId = req.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },

        where: {
            id: adId,
        } 
    });

    return res.json({
        discord: ad.discord,
    });
});

export default appRouter;