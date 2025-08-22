const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Brand Endpoints", () => {
  let brandId;

  test("POST /brands - create new brand", async () => {
    const res = await request(app).post("/brands").send({
      brand: "Test Brand",
      type: "Shoes",
      price: 1000000,
      description: "Desc",
      coverUrl: "http://img.com/cover.jpg"
    });
    expect(res.statusCode).toBe(201);
    brandId = res.body.id;
  });

  test("GET /brands", async () => {
    const res = await request(app).get("/brands");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /brands/:id", async () => {
    const res = await request(app).get(`/brands/${brandId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", brandId);
  });

  test("PUT /brands/:id", async () => {
    const res = await request(app).put(`/brands/${brandId}`).send({
      brand: "Updated Brand",
      type: "Updated",
      price: 200000,
      description: "Updated desc",
      coverUrl: "http://img.com/update.jpg"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.brand).toBe("Updated Brand");
  });

  test("DELETE /brands/:id", async () => {
    const res = await request(app).delete(`/brands/${brandId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Brand deleted");
  });

  test("GET /brands/:id after delete", async () => {
    const res = await request(app).get(`/brands/${brandId}`);
    expect(res.statusCode).toBe(404);
  });
});
