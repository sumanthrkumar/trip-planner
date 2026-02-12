import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('Trip API Endpoints', () => {

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

    it('should successfully create a valid trip', async () => {
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
    });
});