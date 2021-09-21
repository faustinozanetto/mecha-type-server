declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    PORT?: string;
    ENVIRONMENT: Environment;
    SESSION_SECRET: string;
    DISCORD_CLIENT_ID?: string;
    DISCORD_CLIENT_SECRET?: string;
    DISCORD_CALLBACK_URL?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GOOGLE_CALLBACK_URL?: string;
    STEAM_API_KEY?: string;
    STEAM_CALLBACK_URL?: string;
    STEAM_REALM_URL?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    GITHUB_CALLBACK_URL?: string;
  }
  export type Environment = 'DEVELOPMENT' | 'PRODUCTION' | 'TEST';
}
