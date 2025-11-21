# Initial Setup
1. Start the docker container
2. DB should be initialized automatically

# Reset the DB
### (REMOVE ALL USER DATA)
1. Start the docker container
2. Run `docker compose exec -it /bin/bash`
3. Run `node --loader ts-node/esm ./db/reset.ts`

### OR

1. Run `docker compose down -v`
2. Run `docker compose up --build -d`

# Re-Init the DB
1. Start docker container
2. Run `docker compose exec -it /bin/bash`
3. Run `node --loader ts-node/esm ./db/init.ts`