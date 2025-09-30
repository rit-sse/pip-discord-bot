# Dev Env Setup and Config Instructions for the RIT SSE Pip Bot

# Windows Setup
## Pre-reqs
### Docker (Desktop)
Docker is a powerful containerization tool to help put apps into containers. I reccomend Docker Desktop, not just the CLI. However, if you are experienced with Docker and prefer the CLI, go right ahead. Docker Desktop is a Windows app to help manage the Docker containers and their processes. 
Install Docker Desktop from [here](https://www.docker.com/products/docker-desktop/).
[Windows Only] WHILE DOCKER is installing, you may be prompted on WSL (Windows Subsystem for Linux). Be sure to install WSL properly and follow prompts by Docker setup. If you need help, documentation and google are your friend.

To ensure proper installation, please open a terminal and run the `docker` command. The command should print out the command information, not an uknown command error. Ensure you have restarted your PC after the Docker installation and have Docker Desktop open when performing any docker operation.

### WSL
Install WSL either with your Docker Desktop installation or on your own. You can find good install documentation [here](https://learn.microsoft.com/en-us/windows/wsl/install).

To ensure WSL is properly installed, you can run `wsl.exe --list --verbose`. This should list at least one WSL install. 

To ensure WSL and Docker are communicating properly, open a terminal and run `docker run hello-world`. This should output some healthy information. Any problems should be investigated. Documentation and Google will again be your friend here.

### Docker Compose
This should be included with Docker Desktop.

To ensure it is properly installed, please run `docker-compose --verison` in a terminal. This should print a version number, with no errors.


# Linux (Debian, Ubuntu) / Mac Setup
## Pre-reqs
### Docker (Desktop)
Docker is a powerful containerization tool to help put apps into containers. I reccomend Docker Desktop, not just the CLI. However, if you are experienced with Docker and prefer the CLI, go right ahead. Docker Desktop is a Windows app to help manage the Docker containers and their processes. 
If you prefer Docker Desktop, install it [here](https://www.docker.com/products/docker-desktop/). I reccomend Docker Desktop, not just the CLI. However, if you are experienced with Docker and prefer the CLI, go right ahead with the instructions [here](https://docs.docker.com/desktop/setup/install/mac-install/).

### Docker Compose
This should be included with Docker Desktop.

To ensure it is properly installed, please run `docker-compose --verison` in a terminal. This should print a version number, with no errors.

Once you have the above pre-reqs, continue with the environment setup outlined below.

# Startup (All Platforms)
!! Docker Desktop note -- Ensure Docker Desktop is always open and running while performing any Docker operation. 

## 1st Time Startup & Build
1. Ensure you have a .env file based on the env.example found in the project repo.
2. Using an IDE of your choice, open the codebase.
3. Open a new terminal (ctrl/cmd+j), ensure you are in the project root directoy, and enter `docker-compose up --build`. The `--build` flag ensures Docker will build your app from scratch, and cache the resources neccesary to (re-)build it again. The first time, this will take a WHILE, anywhere from 5-10 minutes. Maybe you can run that command while you finish reading this doc!

## Returning Startup & Rebuild
1. Open Docker Desktop (if installed)
2. Using an IDE of your choice, open the codebase.
3. Open a new terminal (ctrl/cmd+j for VS Code), ensure you are in the project root directoy, and enter `docker-compose up`. This terminal must remain open, as it is essentially the location where the app is running.

!! Important note: the `-d` (`docker-compose up -d`) flag runs the Docker image in the background, in a seperate session. Only use this flag when you remember to `docker-compose down` when you are finished, as outlined below. If you want to access your image while developing, I reccomend running without the `-d` flag, as outlined in the command above.

### When You Are Done Developing
1. In a terminal in the project root, and if you used the `-d` flag, run `docker-compose down`. This will safelt stop the service and the container, and 'shut the system down' until you spin it up again.
2. If you did not use the `-d` flag, exit the Docker container with ctrl+c (give it a few seconds, ctrl+c x 1 = graceful shutdown; x 2 = forced shutdown : not great) and closing the terminal AFTER the command line is returned to you. This should safely exit the app and container.
3. It is safe to close the IDE and Docker Desktop is applicable.
