
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../app');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User API', () => {

    it('should register a new user and check for existing user', async () => {
        let res = await request(app)
        .post('/register')
        .send({
          fullname: 'testuser',
          email:'testuser@gmail.com',
          password: 'testpassword'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('fullname', 'testuser');
      res = await request(app)
        .post('/register')
        .send({
          fullname: 'testuser',
          email:'testuser@gmail.com',
          password: 'testpassword'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'User already exists!');
    });

    it('enter all credentials for register', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          fullname: 'testuser',
          password: 'testpassword'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Please enter all the details');
    });

    it('enter a valid email address for register', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          fullname: 'testuser',
          email:'abx',
          password: 'testpassword'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Please enter a valid email address');
    });

    it('should login a user', async () => {
        const hashedPassword = await bcrypt.hash("testpassword", 10);
        await User.create({ fullname: 'testuser', email:'testuser@gmail.com', password: hashedPassword});
        const res = await request(app)
          .post('/login')
          .send({
            email: 'testuser@gmail.com',
            password: 'testpassword'
          });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('fullname', 'testuser');
      });

      it('invalid password for login', async () => {
        const hashedPassword = await bcrypt.hash("testpassword", 10);
        await User.create({ fullname: 'testuser', email:'testuser@gmail.com', password: hashedPassword});
        const res = await request(app)
          .post('/login')
          .send({
            email: 'testuser@gmail.com',
            password: 'testpassword1'
          });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Password is incorrect');
      });

      it('user not found for login', async () => {
        const hashedPassword = await bcrypt.hash("testpassword", 10);
        await User.create({ fullname: 'testuser', email:'testuser@gmail.com', password: hashedPassword});
        const res = await request(app)
          .post('/login')
          .send({
            email: 'testuser1@gmail.com',
            password: 'testpassword'
          });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'User not found!');
      });

      it('enter all credentials for login', async () => {
        const hashedPassword = await bcrypt.hash("testpassword", 10);
        await User.create({ fullname: 'testuser', email:'testuser@gmail.com', password: hashedPassword});
        const res = await request(app)
          .post('/login')
          .send({
            password: 'testpassword'
          });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Please enter all the information');
      });

});