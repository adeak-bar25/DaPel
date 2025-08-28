import dotenv from 'dotenv';

dotenv.config();

export const storeTimeCookieSec = parseInt(process.env.COOKIE_DURATION_SEC);

export const mongoConnectionStr = `${process.env.MONGODB_URI}`;

export const port = process.env.PORT || 3000;

export const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
