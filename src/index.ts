import express from 'express';
import { prisma } from './lib/prisma.js';
import tripRoutes from './routes/tripRoutes.js';
import locationRoutes from './routes/locationRoutes.js';

const app = express();

app.use(express.json())
app.use('/trips', tripRoutes);
app.use('/locations', locationRoutes);

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

app.listen(4000, () => console.log("Alive on port 4000"));