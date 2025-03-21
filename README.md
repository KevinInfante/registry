# Registry

## Description - Usage
This web app is a registry that allows the user to register clients into a database, view them in a table, search them by name or phone number, update the dates they have attended, and delete.

## Description - Design
This is a full-stack web application on the MERN stack. It is built with React on the frontend, and Node.js and Express.js on the backend which interact with a database on MongoDB.

## Build Instructions
To run this project locally you will need to:
- Clone the project
- With Node installed, open the terminal and navigate to the project directory, then to the /backend, and run "npm i" to install the necessary node modules. Repeat for the /frontend folder.
- Create a "config.js" file in the backend folder. In this file, create a variable called "db" with mongodb configuration information as its properties. Export the db variable.
- In the terminal, navigate to the frontend folder and run "npm run build", this will create the production build. Then, navigate to the backend folder, and run "node server.js", the application will then be served to the localhost:{port} URL.
