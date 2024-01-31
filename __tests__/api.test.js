const request = require('supertest');
const app = require('../server');

describe('API tests', () => {
    it('auth/login should return a status 200 and the correct info', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: process.env.VALID_USERNAME,
                password: process.env.VALID_PASSWORD,
            });
        
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.randId).toBeDefined();
    });

    it('auth/signup should detect an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/create-user')
            .send({
                name: process.env.VALID_USERNAME,
                email: "kerparvest69@gmail.com",
                password: process.env.VALID_PASSWORD,
            });

            expect(res.status).toBe(409);
            expect(res.body.msg).toEqual('User with such name already exists!');
    });
});