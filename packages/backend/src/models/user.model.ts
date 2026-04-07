import { pool } from '../config/database';
import { UserDTO } from '@login-app/shared';

export interface User {
    id: number;
    email: string;
    username: string;
    password_hash: string;
    first_name?: string;
    last_name?: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: Date;
    updated_at: Date;
    last_login_at?: Date;
}

export interface CreateUserData {
    email: string;
    username: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
}

export const userModel = {
    async create(data: CreateUserData): Promise<User> {
        const query =  `
        INSERT INTO users (email, username, password_hash, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;
        const values = [
            data.email, 
            data.username,
            data.passwordHash,
            data.firstName || null,
            data.lastName || null,
        ];
        const result = await pool.query<User>(query, values);
        return result.rows[0];
    },

    async findByEmail(email: string): Promise<User | null> {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query<User>(query, [email.toLowerCase()]);
        return result.rows[0] || null;
    },
    
    async findByUsername(username: string): Promise<User | null> {
        const query = `SELECT * FROM users WHERE username = $1`;
        const result = await pool.query<User>(query, [username.toLowerCase()]);
        return result.rows[0] || null;
    }, 

    async findById(id: number): Promise<User | null> {
        const query = `SELECT * FROM users WHERE id = $1`;
        const result = await pool.query<User>(query, [id]);
        return result.rows[0] || null;
    },

    async updateLastLogin(id: number): Promise<void> {
        const query = `UPDATE users SET last_login_at = NOW () WHERE id = $1`;
        await pool.query(query, [id]);
    }, 

    toDTO(user: User): UserDTO { //convert db format into easy to use dto format
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            isActive: user.is_active,
            createdAt: user.created_at.toISOString(),
            updatedAt: user.updated_at.toISOString(),
        };
    },
};