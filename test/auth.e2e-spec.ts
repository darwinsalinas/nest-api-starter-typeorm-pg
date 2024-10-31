import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../src/auth/entities/user.entity';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let request: ReturnType<typeof supertest.default>;

  let repository: Repository<User>;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
    repository = moduleFixture.get('UserRepository');
    request = supertest.default(app.getHttpServer());
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM users;`);
  });

  it('should not login with invalid credentials', async () => {
    const response = await request.post('/auth/login').send({
      email: 'admin@gmail.com',
      password: 'admin',
    });

    expect(response.body).toEqual(
      expect.objectContaining({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid credentials',
      }),
    );
  });

  it('should login successfully', async () => {
    await request
      .post('/auth/register')
      .send({
        email: 'new-user@gmail.com',
        password: 'N3wUser@#.',
        name: 'New User',
      })
      .expect(201);

    return request
      .post('/auth/login')
      .send({
        email: 'new-user@gmail.com',
        password: 'N3wUser@#.',
      })
      .expect(200);
  });

  it('should register a new user successfully', async () => {
    const response = await request
      .post('/auth/register')
      .send({
        email: 'new-user@gmail.com',
        password: 'N3wUser@#.',
        name: 'New User',
      })
      .expect(201);

    const responseUser = response.body;

    expect(responseUser).toHaveProperty('id');
    return;
  });

  it('should NOT register a user with a weak password', async () => {
    const response = await request
      .post('/auth/register')
      .send({
        email: 'test@gmail.com',
        password: '12345',
        name: 'New User',
      })
      .expect(400);

    const responseUser = response.body;

    const bodyResponse = {
      statusCode: 400,
      message: [
        'Password must have at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol',
      ],
      error: 'Bad Request',
    };

    expect(responseUser).toEqual(bodyResponse);
    return;
  });

  it('should NOT register a user with a invalid email', async () => {
    const response = await request
      .post('/auth/register')
      .send({
        email: 'test',
        password: 'N3wUser@#.',
        name: 'New User',
      })
      .expect(400);

    const responseUser = response.body;

    const bodyResponse = {
      statusCode: 400,
      message: ['email must be an email'],
      error: 'Bad Request',
    };

    expect(responseUser).toEqual(bodyResponse);
    return;
  });
});
