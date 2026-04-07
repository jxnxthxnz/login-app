import bcrypt from 'bcrypt';
import { env } from '../config/env';

export const hashPassword = async (password: string): Promise<string> => { //hash password before storage
    return bcrypt.hash(password, env.BCRYPT_ROUNDS);
};

export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    return bcrypt.compare(password, hash); //hash password and compare to existing hash
}