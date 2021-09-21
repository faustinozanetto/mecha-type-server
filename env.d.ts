declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    PORT?: string;
    ENVIRONMENT: Environment;
    DISCORD_CLIENT_ID?: string;
    DISCORD_CLIENT_SECRET?: string;
    DISCORD_CALLBACK_URL?: string;
  }
  export type Environment = 'DEVELOPMENT' | 'PRODUCTION' | 'TEST';
}
