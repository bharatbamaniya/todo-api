import request from "supertest";
import app from "../../src/index";
import User from "../../src/models/User";
import { createUser } from "../services/authService";

beforeAll(async () => {
    await User.deleteMany();
});

afterAll(async () => {
    await User.deleteMany();
});

describe("User Routes", () => {
    it("should signup a new user", async () => {
        const res = await request(app).post("/api/v1/signup").send({ email: "test@example.com", password: "Password@123" });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "User registered successfully");
    });

    it("should not signup user with invalid email", async () => {
        const res = await request(app).post("/api/v1/signup").send({ email: "invalid_email", password: "password@123" });

        expect(res.status).not.toBe(201);
    });

    it("should not signup user with missing fields", async () => {
        const res = await request(app).post("/api/v1/signup").send({ email: "test@example.com" }); // Missing password

        expect(res.status).not.toBe(201);
    });

    it("should not signup user with existing email", async () => {
        await User.create({ email: "existing.email@example.com", password: "hashedPassword" });

        const res = await request(app).post("/api/v1/signup").send({ email: "exiting.email@example.com", password: "password@123" });

        expect(res.status).not.toBe(201);
    });

    it("should login a user", async () => {
        await createUser("should.login@example.com", "password@123");

        const res = await request(app).post("/api/v1/login").send({ email: "should.login@example.com", password: "password@123" });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Logged in successfully");
        expect(res.body.data).toHaveProperty("token");
    });

    it("should not login with invalid credentials", async () => {
        const res = await request(app).post("/api/v1/login").send({ email: "test@example.com", password: "wrongPassword" });

        expect(res.status).toBe(401);
    });

    it("should not login with non-existent user", async () => {
        const res = await request(app).post("/api/v1/login").send({ email: "nonexistent@example.com", password: "password@123" });

        expect(res.status).toBe(401);
    });

    it("should not signup with weak password", async () => {
        const res = await request(app).post("/api/v1/signup").send({ email: "new@example.com", password: "pass123" });

        expect(res.status).toBe(400);
    });
});
