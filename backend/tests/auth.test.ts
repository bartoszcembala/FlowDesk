import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app";

describe("Auth API", () => {
  it("POST /api/users/login should reject empty body", async () => {
    const res = await request(app).post("/api/users/login").send({});

    expect(res.status).toBe(400);
  });

  it("POST /api/users/login should reject invalid credentials", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "wrong@test.com",
      password: "wrongpassword",
    });

    expect([401, 400]).toContain(res.status);
  });
});
