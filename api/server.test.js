const request = require("supertest");
const db = require('../data/dbConfig');
const server = require('./server');

const user1 = {
  username: "user1",
  password: "password1"
};

const user2 = {
  username: "user2",
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
      expect(res.body).toEqual({message: 'username and password are required'});
    });
  });

});

