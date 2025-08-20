const request = require('supertest');
const app = require('../app');
const { Brand, sequelize } = require('../models'); 
const brand = require('../models/brand');

beforeAll(async () => {
    await sequelize.sync({ force: true }); 
});

afterAll(async () => {
    await sequelize.close(); 
});

describe('Brand Endpoints', () => {
    let brandId;

    test('POST /brands - should create a new brand', async () => {
        const res = await request(app)
            .post('/brands')
            .send({
                brand: 'Test Brand',
                type: 'Test Type',
                price: 100,
                description: 'This is a test brand',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('Test Brand');
        brandId = res.body.id;
    });

    // test('GET /brands - should return all brands', async () => {
    //     const res = await request(app).get('/brands');
    //     expect(res.statusCode).toEqual(200);
    //     expect(Array.isArray(res.body)).toBe(true);
    //     expect(res.body.length).toBeGreaterThan(0);
    // });

    // test('GET /brands/:id - should return one brand', async () => {
    //     const res = await request(app).get(`/brands/${brandId}`);
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body).toHaveProperty('id', brandId);
    // });

    // test('PUT /brands/:id - should update brand data', async () => {
    //     const res = await request(app)
    //         .put(`/brands/${brandId}`)
    //         .send({
    //             name: 'Updated Brand',
    //             description: 'Updated description',
    //         });

    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body.name).toBe('Updated Brand');
    // });

    // test('DELETE /brands/:id - should delete brand', async () => {
    //     const res = await request(app).delete(`/brands/${brandId}`);
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body.message).toBe('Brand deleted');
    // });

    // test('GET /brands/:id - after delete should return 404', async () => {
    //     const res = await request(app).get(`/brands/${brandId}`);
    //     expect(res.statusCode).toEqual(404);
    // });
});
