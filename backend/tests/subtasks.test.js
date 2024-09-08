const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../app");
const ParentTask = require("../model/ParentTask");
const SubTask = require("../model/SubTask");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

let mongoServer;
let token;
let task;
let task1;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const hashedPassword = await bcrypt.hash("testpassword", 10);
  const user = await User.create({
    fullname: "testuser",
    email: "testuser@gmail.com",
    password: hashedPassword,
  });
  token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
  task = await ParentTask.create({
    title: "testparenttask",
    description: "testparenttaskdescription",
    user: user._id,
  });
  task1 = await ParentTask.create({
    title: "testparenttask1",
    description: "testparenttaskdescription1",
    user: user._id,
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await ParentTask.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await SubTask.deleteMany({});
});

describe("Subtasks API", () => {
  it("create a testsubtask task for testparenttask", async () => {
    const res = await request(app)
      .post(`/subtasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "testsubtasktitle",
        description: "testsubtaskdescription",
        status: "Completed",
        dueDate: "08/09/2024",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Subtask created successfully");
  });

  it("update a testsubtask and its value from testparenttask", async () => {
    let res = await request(app)
      .post(`/subtasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "testsubtasktitle",
        description: "testsubtaskdescription",
        status: "Completed",
        dueDate: "08/09/2024",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Subtask created successfully");

    res = await request(app)
      .get(`/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "testparenttask");

    const id = res.body.subTasks[0]._id;

    res = await request(app)
      .put(`/subtasks/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "testsubtasktitle",
        description: "testsubtaskdescription",
        status: "To Do",
        dueDate: "08/09/2024",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "subtask updated successfully");

    res = await request(app)
      .get(`/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "testparenttask");
    expect(res.body.subTasks[0]).toHaveProperty("_id", id);
    expect(res.body.subTasks[0]).toHaveProperty("status", "To Do");
  });

  it("different flavours of get for a testsubtask when parent task given", async () => {
    //create a  subtask for task
    let res = await request(app)
      .post(`/subtasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "testsubtasktitle",
        description: "testsubtaskdescription",
        status: "Completed",
        dueDate: "08/09/2024",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Subtask created successfully");

    // create a subtask for task1
    res = await request(app)
      .post(`/subtasks/${task1._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "testsubtasktitle1",
        description: "testsubtaskdescription1",
        status: "In Progress",
        dueDate: "08/09/2024",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Subtask created successfully");

    //create a subtask for another date for parent
    res = await request(app)
      .post(`/subtasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "testsubtasktitle2",
        description: "testsubtaskdescription2",
        status: "To Do",
        dueDate: "09/09/2024",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Subtask created successfully");

    // create a subtask for task1
    res = await request(app)
      .post(`/subtasks/${task1._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "testsubtasktitle3",
        description: "testsubtaskdescription3",
        status: "Postponed",
        dueDate: "09/09/2024",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Subtask created successfully");

    res = await request(app)
      .get(`/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.subTasks.length).toBe(2);
    let subTaskTitles = [
      res.body.subTasks[0].title,
      res.body.subTasks[1].title,
    ];
    expect(subTaskTitles).toContain("testsubtasktitle");
    expect(subTaskTitles).toContain("testsubtasktitle2");

    res = await request(app)
      .get(`/tasks/${task1._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.subTasks.length).toBe(2);
    subTaskTitles = [
      res.body.subTasks[0].title,
      res.body.subTasks[1].title,
    ];
    expect(subTaskTitles).toContain("testsubtasktitle1");
    expect(subTaskTitles).toContain("testsubtasktitle3");
  });

  it("delete a subtask", async () => {
    //create a  subtask for task
    let res = await request(app)
      .post(`/subtasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "testsubtasktitle",
        description: "testsubtaskdescription",
        status: "Completed",
        dueDate: "08/09/2024",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Subtask created successfully");

    res = await request(app)
      .get(`/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "testparenttask");

    const id = res.body.subTasks[0]._id;

    res = await request(app)
      .delete(`/subtasks/${id}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Subtask deleted");
  });
});
