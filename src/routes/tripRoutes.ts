import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { CreateTripSchema, UpdateTripSchema } from '../schemas/trip.schemas.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get("/:id", async(req, res) => {
    const { id } = req.params
    try {
        const trip = await prisma.trip.findUnique({
            where: { id },
            include: {
                locations: {
                    orderBy: [
                        { dayIndex: 'asc' },
                        { sortOrder: 'asc' }
                    ]
                }
            }
        });

        if (!trip) {
            return res.status(404).send("Trip not found!");
        }

        res.status(200).json(trip);
    } catch (error) {
        console.error("Error retrieving trip from database:", error);
        res.status(500).send("Error retrieving Trip");
    }
});

router.post("/", validate(CreateTripSchema), async(req, res) => {
    try {
        const {name, description, startDate, endDate, locations} = req.body;

        const newTrip = await prisma.trip.create({
            data: {
                name, 
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                locations: {
                    create: locations
                }
            },
            include: {
                locations: true
            }
        });

        res.status(201).json(newTrip);
    } catch (error) {
        console.error("Error saving trip to database:", error);
        res.status(500).send("Error creating Trip");
    }    
});

router.post("/update", validate(UpdateTripSchema), async(req, res) => {
    try {
        const {id, locations, ...rest} = req.body;

        const updateData: Prisma.TripUpdateInput = {
            ...rest,
            startDate: rest.startDate ? new Date(rest.startDate) : undefined,
            endDate: rest.endDate ? new Date(rest.endDate) : undefined,
        };

        if (locations) {
            updateData.locations = {
                deleteMany: {}, 
                create: locations 
            };
        }

        const updatedTrip = await prisma.trip.update({
            where: { id },
            data: updateData
        });

        res.status(200).json(updatedTrip);
    } catch (error) {
        console.error("Error updating trip:", error);
        res.status(500).send("Error updating Trip");
    }
});

router.delete("/:id", async(req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).send("Id is needed to delete a trip.");

    try {
        const trip = await prisma.trip.delete({
            where: { id },
            
        });

        if (!trip) {
            res.status(404).send("Trip not found!");
        }

        res.status(200).json(trip);
    } catch (error) {
        console.error("Error deleting trip from database:", error);
        res.status(500).send("Error deleting Trip");
    }
});

export default router;
