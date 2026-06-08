// Shared Hono environment so `c.get('userId')` is typed across the app.
export interface AppEnv {
  Variables: {
    userId: string
  }
}
