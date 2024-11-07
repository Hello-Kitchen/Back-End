import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { JwtService } from '@nestjs/jwt';

describe('Authentication Security Tests', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  describe('JWT Authentication', () => {
    it('should reject requests without JWT token', () => {
      return request(app.getHttpServer())
        .get('/api/1/users')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should reject requests with invalid JWT token', () => {
      return request(app.getHttpServer())
        .get('/api/1/users')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should reject expired JWT tokens', async () => {
      const expiredToken = await jwtService.signAsync(
        { sub: 1, username: 'test' },
        { expiresIn: '0s' },
      );

      return request(app.getHttpServer())
        .get('/api/1/users')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
