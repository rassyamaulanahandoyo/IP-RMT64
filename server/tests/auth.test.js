const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");

beforeAll(async () => {
  await sequelize.query('TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE');
  await User.create({
    email: "admin@mail.com",
    password: "123456",
    role: "admin"
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /register", () => {
  test("Success register", async () => {
    const res = await request(app).post("/register").send({
      email: "staff@mail.com",
      password: "123456"
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("email", "staff@mail.com");
    expect(res.body).toHaveProperty("role", "staff");
  });

  test("Fail register - missing email", async () => {
    const res = await request(app).post("/register").send({ password: "123456" });
    expect(res.status).toBe(400);
  });

  test("Fail register - missing password", async () => {
    const res = await request(app).post("/register").send({ email: "x@mail.com" });
    expect(res.status).toBe(400);
  });

  test("Fail register - duplicate email", async () => {
    await User.create({ email: "dup@mail.com", password: "123456", role: "staff" });
    const res = await request(app).post("/register").send({ email: "dup@mail.com", password: "123456" });
    expect(res.status).toBe(400);
  });
});

describe("POST /login", () => {
  test("Success login returns token", async () => {
    const res = await request(app).post("/login").send({
      email: "admin@mail.com",
      password: "123456"
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("access_token");
  });

  test("Fail login - missing email", async () => {
    const res = await request(app).post("/login").send({ password: "123456" });
    expect(res.status).toBe(400);
  });

  test("Fail login - wrong password", async () => {
    const res = await request(app).post("/login").send({
      email: "admin@mail.com",
      password: "wrong"
    });
    expect(res.status).toBe(401);
  });

  test("Fail login - user not found", async () => {
    const res = await request(app).post("/login").send({
      email: "nouser@mail.com",
      password: "123456"
    });
    expect(res.status).toBe(401);
  });
});
