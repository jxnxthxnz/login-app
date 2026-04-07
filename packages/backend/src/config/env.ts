import dotenv from 'dotenv'; 

dotenv.config(); //load vars from .env to process.env

interface EnvConfig { //properties of env
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRATION: string;
    JWT_REFRESH_EXPIRATON: string;
    BCRYPT_ROUNDS: number;
    ALLOWED_ORIGINS: string[];
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
}

const getEnvVariable = (key: string, defaultValue?: string): string => { //get env variables, validate existence
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value;
}

export const env: EnvConfig = { //actual config object thats imported/exported
    NODE_ENV: getEnvVariable('NODE_ENV', 'development'),
    PORT: parseInt(getEnvVariable('PORT', '5000'), 10), //10 for decimal
    DATABASE_URL: getEnvVariable('DATABASE_URL'),
    DB_HOST: getEnvVariable('DB_HOST', 'localhost'),
    DB_PORT: parseInt(getEnvVariable('DB_PORT', '5432'), 10),
    DB_USER: getEnvVariable('DB_USER', 'postgres'),
    DB_PASSWORD: getEnvVariable('DB_PASSWORD'),
    DB_NAME: getEnvVariable('DB_NAME', 'login-app'),
    JWT_ACCESS_SECRET: getEnvVariable('JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: getEnvVariable('JWT_REFRESH_SECRET'),
    JWT_ACCESS_EXPIRATION: getEnvVariable('JWT_ACCESS_EXPIRATION', '15m'),
    JWT_REFRESH_EXPIRATON: getEnvVariable('JWT_REFRESH_EXPIRATION', '7d'),
    BCRYPT_ROUNDS: parseInt(getEnvVariable('BCRYPT_ROUNDS', '12'), 10), 
    ALLOWED_ORIGINS: getEnvVariable('ALLOWED_ORIGINS', 'http://localhost:5173').split(','),
    RATE_LIMIT_WINDOW_MS: parseInt(getEnvVariable('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(getEnvVariable('RATE_LIMIT_MAX_REQUESTS', '5'), 10)
}





