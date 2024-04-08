# Web Application with Database Skeleton

This repository contains a skeleton project for building a web application with a SQL database, Express API, and a React webpage using Vite. The project is set up to run in a dev container using Visual Studio Code.

## Features

- SQL database using MySQL
- Express API for handling server-side logic
- React webpage with Vite for frontend development
- Dev container configuration for a consistent development environment
- User table displaying user information
- Form to add new users with fields for first name, last name, email, password, address, and age

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed on your machine
- [Visual Studio Code](https://code.visualstudio.com/) installed on your machine
- [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension installed in Visual Studio Code

## Getting Started

1. Clone this repository to your local machine:
   ```
   git clone https://github.com/washyu/webapp_db_skeleton.git
   ```

2. Open the project in Visual Studio Code.

3. When prompted, click on "Reopen in Container" to start the dev container.

4. Wait for the dev container to be built and the dependencies to be installed. This may take a few minutes.

5. Once the dev container is running, open a terminal in Visual Studio Code.

6. In the terminal, navigate to the `server` directory and run the following command to start the Express API:
   ```
   npm run dev
   ```

7. Open another terminal in Visual Studio Code.

8. In the new terminal, navigate to the `client` directory and run the following command to start the React development server:
   ```
   npm run dev
   ```

9. Open your browser and navigate to `http://localhost:3000` to view the web application.

## Configuration

The project uses a dev container to provide a consistent development environment. The dev container configuration files are located in the `.devcontainer` directory.

- `devcontainer.json`: Defines the dev container configuration, including the Docker Compose file to use, the workspace folder, and VS Code settings.
- `Dockerfile`: Specifies the base image and additional dependencies for the dev container.

The project also includes a `docker-compose.yml` file that defines the services required for the application, including the Express API and the MySQL database.

## Project Structure

The project follows a typical structure for a web application with a backend API and a frontend React application:

- `server`: Contains the Express API code and related files.
  - `config`: Configuration files for the database connection.
  - `controllers`: Controller functions for handling API requests.
  - `models`: Sequelize models for defining the database schema.
  - `routes`: Express routes for defining API endpoints.
- `client`: Contains the React webpage code and related files.
  - `src`: Source code for the React application.
    - `components`: React components used in the application.
  - `index.html`: Main HTML file for the React application.
  - `vite.config.js`: Configuration file for Vite.

## Database

The project uses MySQL as the database. The database connection configuration is located in the `server/config/database.js` file. Make sure to update the database credentials in this file to match your environment.

The database schema is defined using Sequelize models. The user model is defined in the `server/models/userModel.js` file.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is open-source and available under the [MIT License](LICENSE).
