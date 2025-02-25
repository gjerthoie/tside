declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string
      JWT_SECRET: string
      CSRF_SECRET: string
      NEXT_PUBLIC_API_URL: string
      NEXT_PUBLIC_FRONTEND_URL: string
      NODE_ENV: "development" | "production" | "test"
    }
  }
}

export {}

