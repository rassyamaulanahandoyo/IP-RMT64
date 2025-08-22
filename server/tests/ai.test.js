jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn()
        }
      }
    };
  });
});

const request = require("supertest");
const OpenAI = require("openai");
const app = require("../app");

describe("POST /ai/summary", () => {
  let mockCreate;

  beforeEach(() => {
    mockCreate = OpenAI().chat.completions.create;
  });

  test("Fail - missing text", async () => {
    const res = await request(app).post("/ai/summary").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Text is required");
  });

  test("Success - returns summary", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "Ringkasan singkat" } }]
    });

    const res = await request(app).post("/ai/summary").send({ text: "Ini deskripsi panjang brand" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("summary", "Ringkasan singkat");
  });

  test("Fail - OpenAI error", async () => {
    mockCreate.mockRejectedValueOnce(new Error("API error"));

    const res = await request(app).post("/ai/summary").send({ text: "Tes error" });
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "OpenAI API error");
  });
});
