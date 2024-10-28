<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Starter API/GraphQL template using Nest.js with TypeORM y Postgresql

1. Clone repo

2. Install dependencies: `yarn install`

3. Clone `.env.example` file content into a `.env` and then add values to the environment variables

4. Run database container: `docker-compose up -d`

5. Run app `yarn start:dev`

6. Seed Database `http://{{host}}:{{port}}/seed`

# Tables

This project creates and manages the following tables:

1. **Roles**

   - Stores information about different roles within the system.
   - Example fields: `id`, `role`

2. **Permissions**

   - Stores information about various permissions that can be assigned to roles or directly assigned to a user
   - Example fields: `id`, `permission`

3. **Users**

   - Stores information about users in the system.
   - Example fields: `id`, `fullName`, `email`, `password`, `isActive`

4. **User Roles**

   - A join table that associates users with roles.
   - Example fields: `user_id`, `role_id`.

5. **Roles Permissions**

   - A join table that associates roles with permissions.
   - Example fields: `role_id`, `permission_id`.

6. **User Permissions**
   - A join table that associates users with permissions directly.
   - Example fields: `user_id`, `permission_id`.

## Database Synchronization

This project is currently set up to ~synchronize~ the models with the ~tables~ in the database using TypeORM. The configuration for this synchronization is done in the `app.module.ts` file as follows:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  // Note: Set `synchronize` to `false` in production to avoid potential data loss.
  // Keeping it `true` is useful for development as it automatically syncs the database schema with your entities.
  synchronize: true, // change to false to avoid
}),
```
