import request from 'supertest';
import { testServer } from '../../test-server';

describe('Budget route testing', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  test('should return Budgets api/budget', async () => {
    const response = await request(testServer.app)
      .get('/api/budget')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBiYjNiYzM3LTdkNjAtNDVlYi05NGVlLTg3N2FhZWQ3NzYyNCIsImlhdCI6MTczNzg0MjMzOCwiZXhwIjoxNzQ4OTAxNTM4fQ.VWcWE6VMmTFUuBP4NUyUM6AsNyvfnWMET6st2kv24gw');

    console.log(response.status);
    console.log(response.body);

  });
});
