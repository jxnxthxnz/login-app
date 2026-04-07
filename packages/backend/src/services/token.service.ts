import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { pool } from '../config/database';

export interface TokenPayload { //goes inside token
    userId: number;
    email: string;
    username: string;
}

export interface RefreshTokenData { //how refresh token is stored in db
    id: number;
    userId: number;
    token: string;
    expiresAt: Date;
    revoked: boolean;
}

export const tokenService = { 
    generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, jwtConfig.access.secret, { //(payload, secret, options), creates a jwt
            expiresIn: jwtConfig.access.expiresIn as jwt.SignOptions['expiresIn'],
        });
    },

    generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, jwtConfig.refresh.secret, {
            expiresIn: jwtConfig.refresh.expiresIn as jwt.SignOptions['expiresIn'],
        });
    },

    verifyAccessToken(token: string): TokenPayload {
        return jwt.verify(token, jwtConfig.access.secret) as TokenPayload;
    },

    verifyRefreshToken(token: string): TokenPayload {
        return jwt.verify(token, jwtConfig.refresh.secret) as TokenPayload;
    },

    async saveRefreshToken(userId: number, token: string): Promise<void> {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const query = `
            INSERT INTO refresh_tokens (user_id, token, expires_at)
            VALUES ($1, $2, $3)
        `;
        await pool.query(query, [userId, token, expiresAt]); //pool query, maintain connetions to db
    }, 

    async findRefreshToken(token: string): Promise<RefreshTokenData | null> {
        const query = `
            SELECT id, user_id as "userId", token, expires_at as "expiresAt", revoked
            FROM refresh_tokens
            WHERE token = $1 AND revoked = false AND expires_at > NOW()
        `;
        const result = await pool.query<RefreshTokenData>(query, [token]);
        return result.rows[0] || null;
    }, 

    async revokeRefreshToken(token: string): Promise<void> {
        const query = 'UPDATE refresh_tokens SET revoked = true WHERE token = $1';
        await pool.query(query, [token]);
    },

    async revokeAllUserTokens(userId: number): Promise<void> {
        const query = 'UPDATE refresh_tokens SET revoked = true WHERE user_id = $1';
        await pool.query(query, [userId]);
    }

}

