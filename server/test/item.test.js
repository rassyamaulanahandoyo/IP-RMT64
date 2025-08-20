const request = require("supertest");
const app = require("../app");
const { sequelize, Brand, Item, User } = require("../models");
const { generateToken } = require("../helpers/jwt");

let adminToken;
let brandId;
let itemId;

beforeAll(async () => {
    await sequelize.sync({ force: true });

    const admin = await User.create({
        email: "admin@mail.com",
        password: "123456",
        role: "admin"
    });

    adminToken = generateToken({ id: admin.id, email: admin.email });

    const brand = await Brand.create({
        name: "Puma",
        description: "Another sport brand"
    });

    brandId = brand.id;

    const item = await Item.create({
        name: "Puma Shoes",
        description: "Running shoes",
        price: 1500000,
        stock: 10,
        BrandId: brandId
    });

    itemId = item.id;
});

afterAll(async () => {
    await sequelize.close();
});

describe("ITEM CRUD TEST", () => {
    test("POST /items - create item", async () => {
        const res = await request(app)
            .post("/items")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Puma T-shirt",
                description: "Sport T-shirt",
                price: 500000,
                stock: 20,
                BrandId: brandId
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.name).toBe("Puma T-shirt");
    });

    test("GET /items - get all items", async () => {
        const res = await request(app).get("/items");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("PUT /items/:id - update item", async () => {
        const res = await request(app)
            .put(`/items/${itemId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Puma Shoes Updated",
                description: "Updated running shoes",
                price: 1600000,
                stock: 12,
                BrandId: brandId
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Item updated successfully");
    });

    test("DELETE /items/:id - delete item", async () => {
        const res = await request(app)
            .delete(`/items/${itemId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Item deleted successfully");
    });
});