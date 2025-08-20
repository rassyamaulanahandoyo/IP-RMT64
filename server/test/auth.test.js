const request = require('supertest')
const app = require('../app')

describe('POST /login', () => {
    test('should fail when email not provided', async () => {
        const res = await request(app).post('/login').send({ password: '123456' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Email/password is required');
    })

    test('should fail when password not provided', async () => {
        const res = await request(app).post('/login').send({ email: 'admin@mail.com' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    test('should fail when email not found', async () => {
        const res = await request(app).post('/login').send({ email: 'notfound@mail.com', password: '123456' });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message');
    });

    test('should fail when password invalid', async () => {
        const res = await request(app).post('/login').send({ email: 'admin@mail.com', password: 'wrongpass' });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message');
    });

    test('should success login and return token', async () => {
        const res = await request(app).post('/login').send({ email: 'assistance.xavier@gmail.com', password: 'xavier' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('access_token');
    });
});