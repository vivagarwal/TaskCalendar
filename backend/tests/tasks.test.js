
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../app');
const ParentTask = require('../model/ParentTask');
const SubTask = require('../model/SubTask');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const hashedPassword = await bcrypt.hash("testpassword", 10);
  const user = await User.create({ fullname: 'testuser', email:'testuser@gmail.com', password: hashedPassword});
  token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await ParentTask.deleteMany({});
});

describe('Tasks API', () => {

    
  it('get all parent task for user', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('tasks',[]);
  });


  it('create a parent task for user', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title:'testparent',
        description:'testparentdescription',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message','Parent task created successfully');
  });


  it('delete a parent task and its subtask for user', async () => {
    let res = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title:'testparent',
      description:'testparentdescription',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message','Parent task created successfully');

    res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200);
    expect(res.body.tasks).toBeDefined();
    expect(res.body.tasks.length).toBeGreaterThan(0); // Ensure there are tasks returned
    // Now access the first task in the array
    expect(res.body.tasks[0]).toHaveProperty('title', 'testparent');

    const id = res.body.tasks[0].id;    
    res = await request(app)
      .delete(`/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message','Parent task and associated subtasks deleted');
  });
  
});