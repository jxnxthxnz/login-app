import { env } from './env';

export const jwtConfig = {
    access: {
        secret: env.JWT_ACCESS_SECRET,
        expiresIn: env.JWT_ACCESS_EXPIRATION,
    },
    refresh: {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: env.JWT_REFRESH_EXPIRATON,
    },
};