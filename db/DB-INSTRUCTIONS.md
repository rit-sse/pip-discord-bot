# Initial Setup
1. Start the docker container
2. DB should be initialized automatically

# Reset the DB
### (REMOVE ALL USER DATA)
1. Start the docker container
2. Run `docker compose exec -it bot /bin/bash`
3. Run `node --loader ts-node/esm ./db/reset.ts`

### OR

1. Run `docker compose down -v`
2. Run `docker compose up --build -d`

# Test the DB
1. Run `docker compose exec -it db /bin/bash`
2. Run `psql -U pipbotuser -d pipbotdb -c "\dt"` - Verify table exists
3. Run `psql -U pipbotuser -d pipbotdb -c "INSERT INTO users (time_verified, discord_id, email, name, is_banned) VALUES (NOW(), 123456789, 'test@example.com', 'Test User', false);"`
4. Run `psql -U pipbotuser -d pipbotdb -c "SELECT * FROM users;"`
5. (Optional) Reset the DB

# Re-Init the DB
1. Start docker container
2. Run `docker compose exec -it db /bin/bash`
3. Run `node --loader ts-node/esm ./db/init.ts`