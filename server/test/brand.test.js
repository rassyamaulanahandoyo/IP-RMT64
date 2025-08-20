const request = require("supertest");
const app = require("../app");
const { sequelize, Brand, User } = require("../models");
const { generateToken } = require("../helpers/jwt");

let adminToken;
let brandId;

beforeAll(async () => {
    await sequelize.sync({ force: true });

    const admin = await User.create({
        email: "admin@mail.com",
        password: "123456",
        role: "admin"
    });

    adminToken = generateToken({ id: admin.id, email: admin.email });

    const brand = await Brand.create({
        name: "Adidas",
        description: "Premium sport brand"
    });

    brandId = brand.id;
});

afterAll(async () => {
    await sequelize.close();
});

describe("BRAND CRUD TEST", () => {
    test("POST /brands - create brand", async () => {
        const res = await request(app)
            .post("/brands")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Nike",
                description: "Best sportswear"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.name).toBe("Nike");
    });

    test("GET /brands - get all brands", async () => {
        const res = await request(app).get("/brands");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("PUT /brands/:id - update brand", async () => {
        const res = await request(app)
            .put(`/brands/${brandId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Adidas Updated",
                description: "Updated description"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Brand updated successfully");
    });

    test("DELETE /brands/:id - delete brand", async () => {
        const res = await request(app)
            .delete(`/brands/${brandId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Brand deleted successfully");
    });
});