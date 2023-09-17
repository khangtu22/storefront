import supertest from 'supertest';
import app from '../../index';
import { createJWTToken } from '../../middlewares/auth';

const request = supertest(app);
const token: string = createJWTToken(1, 'bearer');

describe('Test User Controller', function () {
  it('Should return 200 status code on /api/users', async function () {
    const response = await request
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('Should return a new User after it is created POST: /api/users', async function () {
    const data = {
      firstname: 'TestFirstName',
      lastname: 'TestLastName',
      password: 'TestPassword',
    };

    const response = await request
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    expect(response.status).toBe(200);
    expect(response.body).not.toBeNull();
    expect(response.body.auth).toBe(true);
    expect(response.body.token).not.toBeNull();

    const getProductResponse = await request
      .get(`/api/users/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(getProductResponse.body.id).not.toBeNull();
    expect(getProductResponse.body.firstname).toEqual(data.firstname);
    expect(getProductResponse.body.lastname).toEqual(data.lastname);
  });
});
