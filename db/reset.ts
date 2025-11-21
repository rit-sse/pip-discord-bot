
import { Pool } from "pg";

async function resetDb() {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: "db",
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });

    const client = await pool.connect();
    try {
        await client.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");
        console.log("Database reset: users table truncated");
    } finally {
        client.release();
        await pool.end();
    }
}

resetDb().catch((err) => {
    console.error("Error resetting database:", err);
    process.exit(1);
});