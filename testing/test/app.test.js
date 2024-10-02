// test/app.test.js
const request = require("supertest");
const app = require("../app"); // Import your Express app

describe("Express App Tests", () => {
  it("Post request  request on server ", async () => {
    const obj = {
      name: "hello world",
      age: 69,
      
    };
    const res = await request(app).post("/user").send(obj);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({...obj , id:1});
  });
  // Test the root route (GET /)
  it("GET / should return Hello World", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Hello World!");
  });

  // Test the /user/:id route (GET /user/:id)
  it("GET /user/:id should return a user object with id and name", async () => {
    const response = await request(app).get("/user/123");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: "123", name: "John Doe" });
  });

  it("get user/:id", async () => {
    const response = await request(app).get("/user/46746");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: "46746",
      name: "John Doe",
    });
  });

  // Test POST /user route with valid data
  it("POST /user should create a new user and return 201 status", async () => {
    const response = await request(app)
      .post("/user")
      .send({ name: "Jane Doe", age: 25 });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ id: 1, name: "Jane Doe", age: 25 });
  });

  // Test POST /user route with missing data
  it("POST /user should return 400 if name or age is missing", async () => {
    const response = await request(app)
      .post("/user")
      .send({ name: "Jane Doe" }); // Missing 'age'
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Name and age are required" });
  });

  // Test PUT /user/:id route for updating a user
  it("PUT /user/:id should update user details and return 200 status", async () => {
    const response = await request(app)
      .put("/user/123")
      .send({ name: "Jane Doe", age: 30 });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: "123", name: "Jane Doe", age: 30 });
  });

  // Test PUT /user/:id with missing fields
  it("PUT /user/:id should return 400 if name or age is missing", async () => {
    const response = await request(app)
      .put("/user/123")
      .send({ name: "Jane Doe" }); // Missing 'age'
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Name and age are required" });
  });

  // Test DELETE /user/:id route
  it("DELETE /user/:id should delete the user and return 200 status", async () => {
    const response = await request(app).delete("/user/123");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "User with id 123 deleted" });
  });

  // Test non-existing route
  it("should return 404 for non-existing routes", async () => {
    const response = await request(app).get("/non-existing-route");
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Route not found");
  });
});
