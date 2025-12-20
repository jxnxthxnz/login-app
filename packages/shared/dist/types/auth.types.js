import { z } from 'zod';
//validation schemas
export const loginSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .toLowerCase()
        .max(255, 'Email too long'),
    password: z.string()
        .min(1, 'Password is required')
        .max(128, 'Password too long'),
});
export const registerSchema = z.object({
    userName: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be at most 50 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string()
        .email({ message: 'Invalid email address' })
        .toLowerCase()
        .max(255, 'Email must be at most 255 characters'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])/, 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character')
        .regex(/^\S+$/, 'Password cannot contain spaces'),
    firstName: z.string()
        .min(1)
        .max(100)
        .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
        .optional(),
    lastName: z.string()
        .min(1)
        .max(100)
        .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
        .optional()
});
