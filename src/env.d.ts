declare namespace NodeJS {
    interface ProcessEnv {
      STRIPE_SECRET_KEY: string;
      STRIPE_ENDPOINT_SECRET: string;
    }
  }
  