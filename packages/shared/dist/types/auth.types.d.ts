import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const registerSchema: z.ZodObject<{
    userName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export interface UserDTO {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface AuthResponse {
    success: boolean;
    data: {
        user: UserDTO;
        accessToken: string;
    };
    message?: string;
}
export interface ApiErrorResponse {
    success: false;
    error: {
        message: string;
        code: string;
        details?: unknown;
    };
}
export type ApiResponse<T> = {
    success: true;
    data: T;
    message?: string;
} | ApiErrorResponse;
