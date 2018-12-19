import mongoose from 'mongoose';
import { logger } from './logger';

/**
 * Connect to database
 */
export const connectToDatabase = async () => {
    const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
    const db = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;

    try {
        await mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false });
        logger.info(`Connected to database "${db}"`);
    } catch (err) {
        logger.error(err.message);
        throw new Error(err);
    }
};
