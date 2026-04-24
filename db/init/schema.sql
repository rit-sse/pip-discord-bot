BEGIN;

CREATE TABLE IF NOT EXISTS users (
    discord_id BIGINT PRIMARY KEY,
    server_ids BIGINT[] NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_banned BOOLEAN NOT NULL,
    ban_reason VARCHAR(255),
    verification_level SMALLINT NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS servers (
    server_id BIGINT PRIMARY KEY,
    verified_role_id_1 BIGINT,
    verified_role_id_2 BIGINT,
    verified_role_id_3 BIGINT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Automation for updated_at field
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply automation to users table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Apply automation to servers table
CREATE TRIGGER update_servers_updated_at
BEFORE UPDATE ON servers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMIT;
