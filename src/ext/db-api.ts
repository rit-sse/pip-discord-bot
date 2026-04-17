import { Pool } from "pg";
import VerificationLevels from "./verification-levels";

async function isUserVerified(discordId: string, serverId : string): Promise<boolean> {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: "db",
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });

    const client = await pool.connect();
    
    const res = await client.query("SELECT to_regclass('public.users') AS exists;");
    
    if (!res.rows[0].exists) {
        console.log("Database not initialized.");
        throw new Error("Database not initialized.");
    } else {
        const userRes = await client.query("SELECT * FROM users WHERE discord_id = $1 AND $2 = ANY(server_ids)", [discordId, serverId]);
        return userRes.rowCount != null && userRes.rowCount > 0 && !userRes.rows[0].is_banned;
    }
}

async function getUserVerificationLevel(discordId: string): Promise<VerificationLevels | null> {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: "db",
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });

    const client = await pool.connect();
    
    const res = await client.query("SELECT to_regclass('public.users') AS exists;");
    
    if (!res.rows[0].exists) {
        console.log("Database not initialized.");
        throw new Error("Database not initialized.");
    } else {
        const userRes = await client.query("SELECT * FROM users WHERE discord_id = $1", [discordId]);
        if (userRes.rowCount != null && userRes.rowCount > 0) {
            return userRes.rows[0].verification_level;
        } else {
            return null;
        }
    }
}

// This function is for verifying users with ROOT level, which means they are verified for all servers and can verify additional servers if needed
async function verifyUserAsRoot(discordId: string, email: string, name: string, serverId : string): Promise<void> {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: "db",
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });
    
    const client = await pool.connect();

    const res = await client.query("SELECT to_regclass('public.users') AS exists;");
    
    if (!res.rows[0].exists) {
        console.log("Database not initialized.");
        throw new Error("Database not initialized.");
    } else {
        const fname : string = name.split(' ')[0];
        const lname : string = name.split(' ').slice(1).join(' ');
        await client.query("INSERT INTO users (discord_id, server_ids, email, first_name, last_name, is_banned, verification_level, verified_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [discordId, [serverId], email, fname, lname, false, VerificationLevels.ROOT, new Date(), new Date()]);
    }
}

// This function is for verifying users with SERVER level, which means they are only verified for the server they verified in and cannot verify additional servers without individual manual verifications
async function verifyUserAsServer(discordId: string, email: string, name: string, serverId : string): Promise<void> {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: "db",
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });
    
    const client = await pool.connect();

    const res = await client.query("SELECT to_regclass('public.users') AS exists;");
    
    if (!res.rows[0].exists) {
        console.log("Database not initialized.");
        throw new Error("Database not initialized.");
    } else {
        const fname : string = name.split(' ')[0];
        const lname : string = name.split(' ').slice(1).join(' ');
        await client.query("INSERT INTO users (discord_id, server_ids, email, first_name, last_name, is_banned, verification_level) VALUES ($1, $2, $3, $4, $5, $6, $7)", [discordId, [serverId], email, fname, lname, false, VerificationLevels.SERVER ]);
    }
}

// This function is for verifying users in additional servers, which only works for users with ROOT level
async function verifyUserForServer(discordId: string, serverId: string): Promise<void> {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: "db",
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });
    
    const client = await pool.connect();

    const res = await client.query("SELECT to_regclass('public.users') AS exists;");
    
    if (!res.rows[0].exists) {
        console.log("Database not initialized.");
        throw new Error("Database not initialized.");
    } else {
        const userRes = await client.query("SELECT * FROM users WHERE discord_id = $1", [discordId]);
        if (userRes.rowCount != null && userRes.rowCount > 0) {
            const user = userRes.rows[0];
            if (!user.server_ids.includes(serverId)) {
                if (user.verification_level === VerificationLevels.ROOT) {
                    user.server_ids.push(serverId);
                    await client.query("UPDATE users SET server_ids = $1 WHERE discord_id = $2", [user.server_ids, discordId]);
                } else {
                    throw new Error("User does not have permission to verify in additional servers.");
                }
            }
        } else {
            throw new Error("User not found.");
        }
    }
}

// This function is for manually adding a non ROOT-verified user to a server, which allows a non-RIT user to be verified in additional servers
async function manualVerifyUserForServer(discordId: string, serverId: string): Promise<void> {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: "db",
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });
    
    const client = await pool.connect();

    const res = await client.query("SELECT to_regclass('public.users') AS exists;");

    if (!res.rows[0].exists) {
        console.log("Database not initialized.");
        throw new Error("Database not initialized.");
    } else {
        const userRes = await client.query("SELECT * FROM users WHERE discord_id = $1", [discordId]);
        if (userRes.rowCount != null && userRes.rowCount > 0) {
            const user = userRes.rows[0];
            if (!user.server_ids.includes(serverId)) {
                user.server_ids.push(serverId);
                await client.query("UPDATE users SET server_ids = $1 WHERE discord_id = $2", [user.server_ids, discordId]);
            }
        } else {
            throw new Error("User not found.");
        }
    }
}

async function banUser(discordId: string, reason : string): Promise<void> {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: "db",
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });
    
    const client = await pool.connect();

    const res = await client.query("SELECT to_regclass('public.users') AS exists;");
    
    if (!res.rows[0].exists) {
        console.log("Database not initialized.");
        throw new Error("Database not initialized.");
    } else {
        const userRes = await client.query("SELECT * FROM users WHERE discord_id = $1", [discordId]);
        if (userRes.rowCount != null && userRes.rowCount > 0) {
            await client.query("UPDATE users SET is_banned = true, ban_reason = $1 WHERE discord_id = $2", [reason, discordId]);
        } else {
            throw new Error("User not found.");
        }
    }
}

async function unbanUser(discordId: string): Promise<void> {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: "db",
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });
    
    const client = await pool.connect();

    const res = await client.query("SELECT to_regclass('public.users') AS exists;");
    
    if (!res.rows[0].exists) {
        console.log("Database not initialized.");
        throw new Error("Database not initialized.");
    } else {
        const userRes = await client.query("SELECT * FROM users WHERE discord_id = $1", [discordId]);
        if (userRes.rowCount != null && userRes.rowCount > 0) {
            await client.query("UPDATE users SET is_banned = false, ban_reason = null WHERE discord_id = $1", [discordId]);
        } else {
            throw new Error("User not found.");
        }
    }
}

async function isUserBanned(discordId: string): Promise<boolean> {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: "db",
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });

    const client = await pool.connect();
    
    const res = await client.query("SELECT to_regclass('public.users') AS exists;");
    
    if (!res.rows[0].exists) {
        console.log("Database not initialized.");
        throw new Error("Database not initialized.");
    } else {
        const userRes = await client.query("SELECT * FROM users WHERE discord_id = $1", [discordId]);
        return userRes.rowCount != null && userRes.rowCount > 0 && userRes.rows[0].is_banned;
    }
}


export { isUserVerified, getUserVerificationLevel, verifyUserAsRoot, verifyUserAsServer, verifyUserForServer, manualVerifyUserForServer, banUser, unbanUser, isUserBanned};