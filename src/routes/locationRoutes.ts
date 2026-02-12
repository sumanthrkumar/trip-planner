import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { CreateLocationSchema, UpdateLocationSchema } from '../schemas/location.schemas.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post("/", validate(CreateLocationSchema), async(req, res) => {
    const id = req.params
    try {
        const {tripId, name, latitude, longitude, dayIndex} = req.body;

        const newLocation = await prisma.location.create({
            data: {
                name: name,
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

router.post("/update", validate(UpdateLocationSchema), async(req, res) => {
    try {
        const {id, ...rest} = req.body;

    const updatedLocation = await prisma.location.update({
        where: { id },
        data: rest 
    });

        res.status(200).json(updatedLocation);
    } catch (error) {
        console.error("Error updating location:", error);
        res.status(500).send("Error updating Location");
    }
});

router.delete("/:id", async(req, res) => {
    const { id } = req.params

    try {
        const deletedLocation = await prisma.location.delete({
            where: { id },
        });

        res.status(200).json({
            message: "Location deleted successfully",
            deletedLocation
        });
    } catch (error) {
        console.error("Error deleting location:", error);
        res.status(500).send("Error deleting location");
    }
});


export default router;