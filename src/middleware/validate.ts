import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodTypeAny) => 
(req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = schema.parse(req.body);
        return next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Validation Failed",
                details: error.issues.map(e => ({path: e.path.join('.'), message: e.message}))
            });
        }
        
        console.error("Unexpected error in validation middleware:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}