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
export const __ORIGIN__ = __PROD__ ? 'https://mechatype.vercel.app' : 'http://localhost:3000';

export const __URL__ = __PROD__ ? 'https://mecha-type-api.herokuapp.com' : 'http://localhost:4000';

/**
 * Database URL used in production
 */
export const __DB_URL__ = process.env.DATABASE_URL;

export const __AUTH_REDIRECT__: string = __ORIGIN__ + '/practice';

export const __DISCORD_CALLBACK__: string = __PROD__
  ? __URL__ + process.env.DISCORD_CALLBACK_URL
  : process.env.DISCORD_CALLBACK_URL;
export const __LOCAL_CALLBACK__: string = __PROD__
  ? __URL__ + process.env.LOCAL_CALLBACK_URL
  : process.env.LOCAL_CALLBACK_URL;
export const __GITHUB_CALLBACK__: string = __PROD__
  ? __URL__ + process.env.GITHUB_CALLBACK_URL
  : process.env.GITHUB_CALLBACK_URL;
export const __GOOGLE_CALLBACK__: string = __PROD__
  ? __URL__ + process.env.GOOGLE_CALLBACK_URL
  : process.env.GOOGLE_CALLBACK_URL;
