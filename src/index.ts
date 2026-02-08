import express from 'express';
import { prisma } from './lib/prisma.js';
import { Prisma } from '@prisma/client';

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Server is running!");
});

app.get('/dbCheck', async(req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.send("DB Connection is successful");
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).send("Database connection failed");
    }
    
});

app.get('/trips/:id', async(req, res) => {
    const id = req.params
    try {
        const trip = await prisma.trip.findUnique({
            where: id,
            include: {
                locations: {
                    orderBy: {
                        dayIndex: 'asc'
                    }
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

app.delete('/trips/:id', async(req, res) => {
    const id = req.params
    try {
        const trip = await prisma.trip.delete({
            where: id,
            
        });

        if (!trip) {
            return res.status(404).send("Trip not found!");
        }

        res.status(200).json(trip);
    } catch (error) {
        console.error("Error deleting trip from database:", error);
        res.status(500).send("Error deleting Trip");
    }
});

app.post('/trips', async(req, res) => {
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

app.post('/trips/update', async(req, res) => {
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

app.post('/trips/location/create', async(req, res) => {
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


        res.status(200).json(newLocation);
    } catch (error) {
        console.error("Error creation location:", error);
        res.status(500).send("Error creating Location");
    }
});

app.listen(4000, () => console.log("Alive on port 4000"));