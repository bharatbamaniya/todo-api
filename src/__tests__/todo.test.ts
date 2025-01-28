import request from "supertest";
import app from "../../src/index";
import Todo from "../models/Todo";
import User from "../models/User";
import { createUser } from "../services/authService";
import { IUserPayload } from "../middlewares/authMiddleware";

let token: string;
let todoId: string;
let user: IUserPayload;

beforeAll(async () => {
    await User.deleteMany({});
    await Todo.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({});
    await Todo.deleteMany({});
});

describe("Todo API Tests", () => {
    it("should signup a new user", async () => {
        const res = await request(app).post("/api/v1/signup").send({
            email: "todo@test.com",
            password: "Password123!",
        });

        expect(res.status).toBe(201);
        user = res.body.data;
    });

    it("should login a user", async () => {
        await createUser("should.login@example.com", "password@123");

        const res = await request(app).post("/api/v1/login").send({
            email: "todo@test.com",
            password: "Password123!",
        });

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty("token");
        token = res.body.data.token;
    });

    it("should create a new todo", async () => {
        const res = await request(app).post("/api/v1/todos").set("Authorization", `Bearer ${token}`).send({
            title: "Test Todo",
            description: "This is a test todo",
            dueDate: "2025-01-30T23:59:59Z",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.title).toBe("Test Todo");
        todoId = res.body.data._id; // Save the ID for later tests
    });

    it("should fetch all todos for the user", async () => {
        const res = await request(app).get("/api/v1/todos").set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(1);
    });

    it("should update a todo", async () => {
        const res = await request(app)
            .patch(`/api/v1/todos/${todoId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Updated Todo", completed: true });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.title).toBe("Updated Todo");
        expect(res.body.data.completed).toBe(true);
    });

    it("should not update todo with missing required fields", async () => {
        const res = await request(app)
            .put(`/api/v1/todos/${todoId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ description: "Updated Description" });

        expect(res.status).not.toBe(200);
    });

    it("should fail to update a todo with invalid ID", async () => {
        const res = await request(app).patch("/api/v1/todos/invalid-id").set("Authorization", `Bearer ${token}`).send({ title: "Fail Update" });

        expect(res.statusCode).toBe(500);
    });

    it("should delete a todo", async () => {
        const res = await request(app).delete(`/api/v1/todos/${todoId}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Todo deleted successfully");
    });

    it("should fail to delete a non-existent todo", async () => {
        const res = await request(app).delete(`/api/v1/todos/${todoId}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Todo not found");
    });

    it("should not create todo with missing fields", async () => {
        const res = await request(app)
            .post("/api/v1/todos")
            .set("Authorization", `Bearer ${token}`)
            .send({ description: "Test Description", dueDate: "2024-12-31" });

        expect(res.status).not.toBe(201);
    });

    it("should not create todo with invalid dueDate", async () => {
        const res = await request(app)
            .post("/api/v1/todos")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Test Todo", description: "Test Description", dueDate: "invalidDate" });

        expect(res.status).not.toBe(201);
    });

    it("should get all todos for the authenticated user", async () => {
        await Todo.deleteMany({});

        await Todo.create({
            title: "Todo 1",
            description: "Description 1",
            dueDate: "2026-01-01",
            user: user._id?.toString(),
        });
        await Todo.create({
            title: "Todo 2",
            description: "Description 2",
            dueDate: "2026-01-01",
            user: user._id?.toString(),
        });

        const res = await request(app).get("/api/v1/todos").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);
    });

    it("should get a specific todo", async () => {
        const createdTodo = await Todo.create({
            title: "Test Todo",
            description: "Test Description",
            dueDate: "2026-01-01",
            user: user._id,
        });

        const res = await request(app).get(`/api/v1/todos/${createdTodo._id}`).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty("_id", createdTodo._id?.toString());
    });

    it("should not get a todo that belongs to another user", async () => {
        const anotherUser = await createUser("another@example.com", "hasedpassword@123");
        const createdTodo = await Todo.create({
            title: "Test Todo",
            description: "Test Description",
            dueDate: "2026-01-01",
            user: anotherUser._id?.toString(),
        });
        const res = await request(app).get(`/api/v1/todos/${createdTodo._id?.toString()}`).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(401);
    });
});
