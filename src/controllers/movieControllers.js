const movies = [
	{
		id: 1,
		title: "Citizen Kane",
		director: "Orson Wells",
		year: "1941",
		color: false,
		duration: 120,
	},
	{
		id: 2,
		title: "The Godfather",
		director: "Francis Ford Coppola",
		year: "1972",
		color: true,
		duration: 180,
	},
	{
		id: 3,
		title: "Pulp Fiction",
		director: "Quentin Tarantino",
		year: "1994",
		color: true,
		duration: 180,
	},
];

const database = require("../../database");

const getMovies = (req, res) => {
	database
		.query("select * from movies")
		.then((result) => {
			const movies = result[0];
			res.json(movies);

			console.log(movies);
		})
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
};

const getAllUsers = (req, res) => {
	database
		.query("select * from users")
		.then(([users]) => {
			res.json(users[0]);
		})
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
};

const getMovieById = (req, res) => {
	const id = parseInt(req.params.id);

	database
		.query("select * from movies where id = ?", [id])
		.then(([movies]) => {
			if (movies[0] != null) {
				res.json(movies[0]);
			} else {
				res.sendStatus(404);
			}
		})
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
};

const getUsersById = (req, res) => {
	const id = parseInt(req.params.id);
	database
		.query("select * from users where id = ? ", [id])
		.then(([users]) => {
			if (users[0] != null) {
				res.json(users[0]);
			} else {
				res.sendStatus(404);
			}
		})
		.catch((err) => {
			console.err(err);
			res.sendStatus(500);
		});
};

module.exports = {
	getMovies,
	getMovieById,
	getAllUsers,
	getUsersById,
};