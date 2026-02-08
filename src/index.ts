import express from 'express';
import { prisma } from './lib/prisma.js';

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

app.listen(4000, () => console.log("Alive on port 4000"));