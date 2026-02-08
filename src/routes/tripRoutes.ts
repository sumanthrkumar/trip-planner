import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get("/:id", async(req, res) => {
    const id = req.params
    try {
        const trip = await prisma.trip.findUnique({
            where: id,
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

router.post("/", async(req, res) => {
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

router.post("/trips/update", async(req, res) => {
    try {
        const {id, name, description, startDate, endDate} = req.body;

        const updateData: Prisma.TripUpdateInput = {};

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (startDate) updateData.startDate = new Date(startDate);
        if (endDate) updateData.endDate = new Date(endDate);

        if (startDate && endDate) {
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);

            if (start > end) {
                return res.status(400).send("End date cannot be before Start date.");
            }
        }
    
        const newTrip = await prisma.trip.update({
            where: { id },
            data: updateData
        });

        res.status(200).json(newTrip);
    } catch (error) {
        console.error("Error updating trip:", error);
        res.status(500).send("Error updating Trip");
    }
});

router.delete("/trips/:id", async(req, res) => {
    const id = req.params
    if (!id) return res.status(400).send("Id is needed to delete a trip.");

    try {
        const trip = await prisma.trip.delete({
            where: id,
            
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
