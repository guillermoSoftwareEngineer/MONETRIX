import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    const testUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'Password123!',
        fullName: 'Test User',
    };

    it('/auth/register (POST)', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send(testUser)
            .expect(201)
            .expect((res) => {
                expect(res.body.user).toBeDefined();
                expect(res.body.user.email).toBe(testUser.email);
                expect(res.body.user.password).toBeUndefined();
            });
    });

    it('/auth/login (POST) - Success', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.access_token).toBeDefined();
                expect(res.body.user.email).toBe(testUser.email);
            });
    });

    it('/auth/login (POST) - Failure (Wrong Password)', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword',
            })
            .expect(401)
            .expect((res) => {
                expect(res.body.message).toBe('Credenciales inválidas');
            });
    });

    it('/auth/login (POST) - Failure (Non-existent User)', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'anypassword',
            })
            .expect(401)
            .expect((res) => {
                expect(res.body.message).toBe('Credenciales inválidas');
            });
    });
});
