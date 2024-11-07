import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Input Validation Security Tests', () => {
  let app: INestApplication;
  let validToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/api/login')
      .send({ username: 'validUser', password: 'validPass' });
    validToken = loginResponse.body.access_token;
  });

  describe('SQL Injection Prevention', () => {
    it('should sanitize SQL injection attempts in query params', async () => {
      const maliciousId = '1; DROP TABLE users;';

      return request(app.getHttpServer())
        .get(`/api/restaurants/${maliciousId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('XSS Prevention', () => {
    it('should sanitize XSS attempts in body', async () => {
      const maliciousData = {
        name: '<script>alert("XSS")</script>',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/api/1/users')
        .set('Authorization', `Bearer ${validToken}`)
        .send(maliciousData)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('NoSQL Injection Prevention', () => {
    it('should prevent NoSQL injection in query parameters', async () => {
      const maliciousQuery = { $gt: '' };

      return request(app.getHttpServer())
        .get('/api/1/users')
        .set('Authorization', `Bearer ${validToken}`)
        .query({ id: JSON.stringify(maliciousQuery) })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
