/**
 * Returns true if app is in production or false if in development.
 */
export const __PROD__: boolean = process.env.NODE_ENV === 'production';

/**
 * Returns the port used on production
 */
export const __PORT__ = process.env.PORT || 4000;

/**
 * Return the origin uri.
 */
export const __ORIGIN__ = __PROD__ ? 'https://mecha-type.vercel.app' : 'http://localhost:3000';

/**
 * Database URL used in production
 */
export const __DB_URL__ = process.env.DATABASE_URL;
