
import { Pool } from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async function initDb() {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: "db",
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });

    const client = await pool.connect();
    try {
        // Check if the users table exists
        const res = await client.query("SELECT to_regclass('public.users') AS exists;");
        if (!res.rows[0].exists) {
            // If not, run schema.sql to create it
            const schema = fs.readFileSync(path.join(__dirname, "./schema.sql"), "utf-8");
            await client.query(schema);
            console.log("Database schema initialized.");
        } else {
            console.log("Database schema already exists. No changes made.");
        }
    } finally {
        client.release();
        await pool.end();
    }
})().catch((err) => {
    console.error("Error initializing database:", err);
    process.exit(1);
});