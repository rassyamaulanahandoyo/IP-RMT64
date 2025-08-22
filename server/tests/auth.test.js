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
    const res = await request(app)
      .post("/register")
      .send({
        email: "staff@mail.com",
        password: "123456"
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", "staff@mail.com");
    expect(res.body).toHaveProperty("role", "staff");
  });

  test("Fail register - missing email", async () => {
    const res = await request(app)
      .post("/register")
      .send({ password: "123456" });
    expect(res.status).toBe(400);
  });
});

describe("POST /login", () => {
  test("Success login returns token", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "admin@mail.com",
        password: "123456"
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("access_token");
    expect(res.body).toHaveProperty("email", "admin@mail.com");
    expect(res.body).toHaveProperty("role", "admin");
  });

  test("Invalid email/password", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "admin@mail.com",
        password: "salah"
      });
    expect(res.status).toBe(500);
  });

  test("Invalid email/password", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "notfound@mail.com",
        password: "123456"
      });
    expect(res.status).toBe(500);
  });
});
