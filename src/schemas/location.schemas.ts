import { z } from 'zod';

export const LocationShape = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long."),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    dayIndex: z.number().int().nonnegative().optional()
});

export const CreateLocationSchema = LocationShape.extend({
    tripId: z.uuid({ message: "tripId is required and must be a UUID" })
});

export const UpdateLocationSchema = LocationShape.partial().extend({
    id: z.uuid("Invalid Location ID format")
});