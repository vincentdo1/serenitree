import { drizzle } from "drizzle-orm/postgres-js";
import type { Context } from 'hono'
import postgres from "postgres";

import * as schema from '../schema'

const dbConfig = {
    host: "serenitree.c1i4kckiamtd.us-east-2.rds.amazonaws.com",
    port: 5432,
    user: "postgres",
    password: "serenitree",
    database: "serenitreedb",
  };

export default async function connectDB(c: Context, next: Function) {
    const sql = postgres(`postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

    
    const db = drizzle(sql, {schema});

    c.set('db', db)

    await next()
}