import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { before } from 'node:test';
import { prisma } from '../lib/prisma.js';

describe('Trip API Endpoints', () => {

    beforeEach(async() => {
        await prisma.location.deleteMany();
        await prisma.trip.deleteMany();

    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should fail to create a trip with an end date before start date', async () => {
        const response = await request(app)
            .post('/trips')
            .send({
                name: "Invalid dates trip",
                startDate: "2026-05-20T12:00:00Z",
                endDate: "2026-05-10T12:00:00Z"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation Failed");
        expect(response.body.details[0].message).toContain("End date cannot be before Start date");
    });

    it('should return a 404 for retrieving a trip that does not exist', async () => {
        const get_response = await request(app)
            .get('/trips/fakeID');

        expect(get_response.status).toBe(404);
    });

    it('should successfully create, retrieve, update, and delete a trip', async () => {
        // Testing POST endpoint - create a trip
        const response = await request(app)
            .post('/trips')
            .send({
                name: "Summer Vacation",
                description: "My summer vacation",
                startDate: "2026-06-01T10:00:00Z",
                endDate: "2026-06-15T10:00:00Z"
            });

        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe("Summer Vacation")
        expect(response.body.description).toBe("My summer vacation")
        expect(response.body.startDate).toBe("2026-06-01T10:00:00.000Z")
        expect(response.body.endDate).toBe("2026-06-15T10:00:00.000Z")
        const id = response.body.id;

        // Testing GET endpoint - retrieve a trip
        const get_response = await request(app)
            .get('/trips/' + id);

        expect(get_response.status).toBe(200);
        expect(get_response.body).toHaveProperty('id');
        expect(get_response.body.id).toBe(id);
        expect(get_response.body.name).toBe("Summer Vacation")
        expect(get_response.body.description).toBe("My summer vacation")
        expect(get_response.body.startDate).toBe("2026-06-01T10:00:00.000Z")
        expect(get_response.body.endDate).toBe("2026-06-15T10:00:00.000Z")

        
        // Testing POST endpoint - update a trip
        const update_response = await request(app)
            .post('/trips/update')
            .send({
                id: id,
                name: "Winter Vacation",
                description: "My Winter vacation!",
                startDate: "2026-11-01T10:00:00Z",
                endDate: "2026-11-15T10:00:00Z"
            });

        expect(update_response.status).toBe(200);
        expect(update_response.body).toHaveProperty('id');
        expect(update_response.body.id).toBe(id);
        expect(update_response.body.name).toBe("Winter Vacation")
        expect(update_response.body.description).toBe("My Winter vacation!")
        expect(update_response.body.startDate).toBe("2026-11-01T10:00:00.000Z")
        expect(update_response.body.endDate).toBe("2026-11-15T10:00:00.000Z")


        // Testing DELETE endpoint - delete a trip
        const delete_response = await request(app).delete('/trips/' + id);

        expect(delete_response.status).toBe(200);
    });
});