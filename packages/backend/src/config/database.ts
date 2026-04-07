import { Pool } from 'pg';
import { env } from './env';

export const pool = new Pool({
    host: env.DB_HOST,
    port: env.PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    max: 20,
    idleTimeoutMillis: 30000, //keep idle connections open for 30s
    connectionTimeoutMillis: 2000 //only wait 2s to try to connect
})

pool.on('connect', () => { //every time a new connection is created
    console.log('Database connection established');
});

pool.on('error', (err) => {
    console.log('Unexpected database error', err);
    process.exit(1); //stop node app
})

export const testDatabaseConnection = async (): Promise<void> => { //test if db works
    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        console.log('Database connection test successful');
    }
    catch (error) {
        console.error('Database connection test failed', error);
        throw error;
    }
}