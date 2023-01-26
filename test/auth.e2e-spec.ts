import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "src/auth/entities/user.entity";
import * as request from 'supertest';
import { Repository } from "typeorm";
import { AppModule } from '../src/app.module';


describe('AuthController (e2e)', () => {

    let app: INestApplication;


    let repository: Repository<User>;
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe(
            {
                whitelist: true,
                forbidNonWhitelisted: true,
            }
        ));

        await app.init();
        repository = moduleFixture.get('UserRepository');
    });

    afterEach(async () => {
        await repository.query(`DELETE FROM users;`);
    });

    it('should not login with invalid credentials', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'admin@gmail.com',
                password: 'admin',
            })
            .expect(400)
            .expect('{"statusCode":400,"message":"Invalid credentials","error":"Bad Request"}');
    });

    it('should login succesfully', async () => {
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'new-user@gmail.com',
                password: 'N3wUser@#.',
                fullName: 'New User',
            })
            .expect(201);

        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'new-user@gmail.com',
                password: 'N3wUser@#.'
            })
            .expect(200);
    });

    it('should register a new user successfully', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'new-user@gmail.com',
                password: 'N3wUser@#.',
                fullName: 'New User',
            })
            .expect(201);

        const responseUser = response.body;

        expect(responseUser).toHaveProperty('id');
        return;
    });


    it('should NOT register a user with a weak password', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'test@gmail.com',
                password: '12345',
                fullName: 'New User',
            }).expect(400);

        const responseUser = response.body;

        const bodyResponse = {
            "statusCode": 400,
            "message": [
                "Password must have at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol"
            ],
            "error": "Bad Request"
        }

        expect(responseUser).toEqual(bodyResponse);
        return;
    });

    it('should NOT register a user with a invalid email', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'test',
                password: 'N3wUser@#.',
                fullName: 'New User',
            }).expect(400);

        const responseUser = response.body;

        const bodyResponse = {
            "statusCode": 400,
            "message": [
                "email must be an email"
            ],
            "error": "Bad Request"
        }

        expect(responseUser).toEqual(bodyResponse);
        return;
    });

});