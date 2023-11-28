const request = require("supertest");

const app = require("../src/app");
describe("GET /api/users", () => {
	it("should return all users", async () => {
		const response = await request(app).get("/api/users");

		expect(response.headers["content-type"]).toMatch(/json/);

		expect(response.status).toEqual(200);
	});
});

describe("GET /api/users/:id", () => {
	it("should return one user", async () => {
		const response = await request(app).get("/api/users/1");

		expect(response.headers["content-type"]).toMatch(/json/);

		expect(response.status).toEqual(200);
	});

	it("should return no user", async () => {
		const response = await request(app).get("/api/users/0");

		expect(response.status).toEqual(404);
	});
});

const crypto = require("node:crypto");
const database = require("../database");

describe("POST /api/users", () => {
	it("should return created user", async () => {
		const newUser = {
			firstname: "Marie",
			lastname: "Martin",
			email: `${crypto.randomUUID()}@wild.co`,
			city: "Paris",
			language: "French",
		};

		const response = await request(app).post("/api/users").send(newUser);

		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.status).toEqual(201);
		expect(response.body).toHaveProperty("id");
		expect(typeof response.body.id).toBe("number");

		const [result] = await database.query(
			"SELECT * FROM users WHERE id=?",
			response.body.id
		);
		const [usersInDatabase] = result;

		expect(usersInDatabase).toHaveProperty("firstname");
		expect(usersInDatabase).toHaveProperty("lastname");
		expect(usersInDatabase).toHaveProperty("email");
		expect(usersInDatabase).toHaveProperty("city");
		expect(usersInDatabase).toHaveProperty("language");
		expect(typeof usersInDatabase.firstname).toBe("string");
		expect(typeof usersInDatabase.lastname).toBe("string");
		expect(typeof usersInDatabase.email).toBe("string");
		expect(typeof usersInDatabase.city).toBe("string");
		expect(typeof usersInDatabase.language).toBe("string");
		expect(usersInDatabase.title).toStrictEqual(newUser.title);
	});
});

describe("PUT /api/users/:id", () => {
	it("should edit movie", async () => {
		const newUser = {
			firstname: "Maria",
			lastname: "Martine",
			email: `${crypto.randomUUID()}@wild.co`,
			city: "Lille",
			language: "French",
		};

		const [result] = await database.query(
			"INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
			[
				newUser.firstname,
				newUser.lastname,
				newUser.email,
				newUser.city,
				newUser.language,
			]
		);

		const id = result.insertId;

		const updatedUsers = {
			firstname: "Maria",
			lastname: "Martine",
			email: `${crypto.randomUUID()}@wild.co`,
			city: "Lille",
			language: "French",
		};

		const response = await request(app)
			.put(`/api/users/${id}`)
			.send(updatedUsers);

		expect(response.status).toEqual(204);

		const [users] = await database.query(
			"SELECT * FROM users WHERE id=?",
			id
		);

		const [usersInDatabase] = users;

		expect(usersInDatabase).toHaveProperty("id");

		expect(usersInDatabase).toHaveProperty("firstname");
		expect(usersInDatabase.firstname).toStrictEqual(updatedUsers.firstname);

		expect(usersInDatabase).toHaveProperty("lastname");
		expect(usersInDatabase.lastname).toStrictEqual(updatedUsers.lastname);

		expect(usersInDatabase).toHaveProperty("email");
		expect(usersInDatabase.email).toStrictEqual(updatedUsers.email);

		expect(usersInDatabase).toHaveProperty("city");
		expect(usersInDatabase.city).toStrictEqual(updatedUsers.city);

		expect(usersInDatabase).toHaveProperty("language");
		expect(usersInDatabase.language).toStrictEqual(updatedUsers.language);
	});

	it("should return an error", async () => {
		const usersWithMissingProps = { title: "Harry Potter" };

		const response = await request(app)
			.put(`/api/users/1`)
			.send(usersWithMissingProps);

		expect(response.status).toEqual(500);
	});
});
