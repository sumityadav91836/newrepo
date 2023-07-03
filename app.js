const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json()); //This line is written for Add Book API

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initilizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3002, () => {
      console.log("Server Running at http://localhost/:3002/");
    });
  } catch (err) {
    console.log(`DB Error: ${err.message}`);
    process.exit(1);
  }
};

initilizeDBAndServer();
module.exports = app.js;

// Get movies Array;
app.get("/movies/", async (request, response) => {
  const moviesNames = `
    SELECT movie_name
    FROM movie`;
  const moviesArray = await db.all(moviesNames);
  response.send(moviesArray);
});

// Post a movie in the table
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovie = ` 
    INSERT INTO 
        movie (directorId, movieName, leadActor)
    VALUES 
        (
            '${directorId}'
            '${movieName}'
            '${leadActor}';`;
  const dbResponse = await db.run(addMovie);
  const movieId = dbResponse.lastID;
  response.send("Movie Successfully Added");
});

// Get a movie
app.get("/movies/:movieId", async (request, response) => {
  const movieId = request.params;
  const getMovie = `
    SELECT *
    FROM movie
    WHERE movie_id = ${movieId}`;
  const movie = await db.get(getMovie);
  response.send(movie);
});
