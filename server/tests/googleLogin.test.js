const request = require("supertest");
const app = require("../app");

jest.mock("google-auth-library", () => {
  return {
    OAuth2Client: jest.fn(() => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        getPayload: () => ({ email: "google@mail.com", name: "Google User" })
      })
    }))
  };
});

describe("POST /google-login", () => {
  test("Success google login", async () => {
    const res = await request(app).post("/google-login").send({ tokenId: "fake-token" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("access_token");
    expect(res.body.email).toBe("google@mail.com");
  });
});
