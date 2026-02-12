import { z } from 'zod';

export const TripShape = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long."),
    description: z.string().optional(),
    startDate: z.iso.datetime({ message: "Invalid start date formate"}),
    endDate: z.iso.datetime({ message: "Invalid end date formate"}),
    locations: z.array(z.object({
        name: z.string().min(3, "Name must be at least 3 characters long."),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        dayIndex: z.number().int().nonnegative().optional()
    })).optional()
});

export const CreateTripSchema = TripShape.refine((data) => {
    return new Date(data.endDate) >= new Date(data.startDate);
}, {
    message: "End date cannot be before Start date",
    path: ["endDate"]
});

export const UpdateTripSchema = TripShape.partial().extend({
    id: z.uuid("Invalid Trip ID format")
});



