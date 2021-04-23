const request = require("supertest");
const db = require('../data/dbConfig');
const server = require('./server');

const user1 = {
  username: "user1",
  password: "password1"
};

const user2 = {
  username: "user4",
  password: "password1"
};

const badUser = {
  username: "",
  password: "password1"
};

test('sanity', () => {
  expect(true).not.toBe(false);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
});

describe("User Tests", () => {
  describe("[POST] /register", () => {
    test("Responds with new user", async () => {
      let res;
      res = await request(server).post("/api/auth/register").send(user1);
      expect(res.body.username).toEqual(user1.username);
    });
    test("Requires username and password", async () => {
      let res;
      res = await request(server).post("/api/auth/register").send(badUser);
      expect(res.body).toMatchObject({message: 'username and password are required'});
    });
  });

  describe("[POST] /login", () => {
    test("Checks if username valid", async () => {
      let res;
      res = await request(server).post("/api/auth/login").send(user1);
      console.log("res.body: ", res.body);
      expect(res.body).toMatchObject({message: 'invalid credentials'});
    });
  });
});

