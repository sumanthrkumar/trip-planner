import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get("/create", async(req, res) => {
const id = req.params
    try {
        const {tripId, name, latitude, longitude, dayIndex} = req.body;

        if (!tripId) return res.status(400).send("tripId is required.");
        if (latitude === undefined || longitude === undefined) {
            return res.status(400).send("Coordinates are required.");
        }

        const newLocation = await prisma.location.create({
            data: {
                name: name || "Unnamed Location",
                latitude, 
                longitude,
                dayIndex,
                trip: {
                    connect: {id: tripId}
                }
            }
            
        });


        res.status(201).json(newLocation);
    } catch (error) {
        console.error("Error creation location:", error);
        res.status(500).send("Error creating Location");
    }
});

export default router;