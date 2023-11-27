require("dotenv").config();
const express = require("express");

const port = process.env.APP_PORT;

const app = express();

const movieControllers = require("./controllers/movieControllers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.get("/api/users", movieControllers.getAllUsers);
app.get("/api/users/:id", movieControllers.getUsersById);
app.post("/api/movies", movieControllers.postMovie);

module.exports = app;
