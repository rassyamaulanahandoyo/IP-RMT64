const request = require("supertest");
const app = require("../app");

jest.mock("midtrans-client", () => {
  return {
    Snap: jest.fn().mockImplementation(() => ({
      createTransaction: jest.fn().mockResolvedValue({
        token: "dummy-token",
        redirect_url: "http://dummy-url"
      })
    }))
  };
});

describe("POST /checkout", () => {
  test("Fail checkout - empty items", async () => {
    const res = await request(app).post("/checkout").send({
      items: [],
      totalPrice: 0,
      customer: {}
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Keranjang kosong!");
  });

  test("Success checkout", async () => {
    const res = await request(app).post("/checkout").send({
      items: [{ id: 1, price: 10000, quantity: 2, name: "Test Item" }],
      totalPrice: 20000,
      customer: { name: "Tester", email: "test@mail.com" }
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token", "dummy-token");
  });
});
