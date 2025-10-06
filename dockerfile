# Project: RIT SSE Pip Bot
# Purpose: Dockerfile for project portability\

# 9/30/2025
# Author: Orion Mulgrew | RIT SSE

# SUPER simple and easy dockerfile
# See comments for info.

# ----- DO NOT EDIT BELOW THIS LINE -----

# Official Node.js v18 runtime as our parent image.
# Bullseye: Debian 11
# Slim: Less packages, less space required
FROM node:18-bullseye-slim

# Container's working directory
WORKDIR /usr/src/pip-bot

# Copy package infos
COPY package*.json ./

# Install dependencies
RUN npm ci

# Move rest of source code
COPY . .

# When container is ready, this will run as "{arg1} {arg2}" in the container's command line
CMD ["npm", "run", "start"]
