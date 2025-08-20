const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { User } = require('../models');
const { generateToken } = require('../helpers/jwt');

let adminToken;
let staffToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const admin = await User.create({
    email: 'assistance.xavier@gmail.com',
    password: 'xavier',
    role: 'admin'
  });

  adminToken = generateToken({ id: admin.id, email: admin.email });

  const staff = await User.create({
    email: 'assistance.khanz@gmail.com',
    password: 'khanz',
    role: 'staff'
  });

  staffToken = generateToken({ id: staff.id, email: staff.email });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /users (Add Staff)', () => {
  test('Berhasil register staff (oleh admin)', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', adminToken)
      .send({
        email: 'newstaff@mail.com',
        password: 'newpassword',
        role: 'staff'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', 'newstaff@mail.com');
  });

  test('Email tidak diberikan', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', adminToken)
      .send({
        password: 'somepassword',
        role: 'staff'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('Password tidak diberikan', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', adminToken)
      .send({
        email: 'someone@mail.com',
        role: 'staff'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('Email kosong string', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', adminToken)
      .send({
        email: '',
        password: 'somepassword',
        role: 'staff'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('Password kosong string', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', adminToken)
      .send({
        email: 'someone@mail.com',
        password: '',
        role: 'staff'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('Email sudah terdaftar', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', adminToken)
      .send({
        email: 'assistance.khanz@gmail.com', 
        password: 'khanz',
        role: 'staff'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('Format email salah', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', adminToken)
      .send({
        email: 'notanemail',
        password: 'somepassword',
        role: 'staff'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('Gagal register karena belum login (no token)', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        email: 'unauth@mail.com',
        password: 'somepassword',
        role: 'staff'
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  test('Token tidak valid (random string)', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', 'randomstring123')
      .send({
        email: 'invalidtoken@mail.com',
        password: 'somepassword',
        role: 'staff'
      });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message');
  });

  test('Gagal register karena role bukan admin', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', staffToken)
      .send({
        email: 'notadmin@mail.com',
        password: 'somepassword',
        role: 'staff'
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message');
  });
});