declare namespace NodeJS {
  export interface ProcessEnv {
    // app config
    NODE_ENV: 'development' | 'test' | 'production';
    PORT: string;

    // database config
    DATABASE_MONGO_URI: string;
  }
}
