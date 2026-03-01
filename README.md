# LMS Backend (NestJS)

A small Library Management System (LMS) backend built with NestJS, MongoDB (Mongoose), and JWT-based authentication.

This repository contains a simple API for user registration/login, role-based course management (Admin), and public course listing.


## Project overview
This project is a starter backend for an LMS. It implements:
- User registration and login with hashed passwords and JWT authentication.
- Role-based access control (Admin / Student).
- Course CRUD operations (create/update/delete restricted to Admins).
- Mongoose schemas for persisting users and courses.

Files to look at for core behavior:
- `src/main.ts` - app bootstrap
- `src/app.module.ts` - module wiring (Config, Mongoose, modules)
- `src/auth/*` - authentication controllers, services, JWT setup
- `src/course/*` - course controller, service, DTOs and schema
- `src/user/*` - user service, schema, and role types


## Features
- Register and login users
- JWT-based protected endpoints
- Role-based authorization (Admin-only course management)
- Input validation using class-validator


## Tech stack
- Node.js + TypeScript
- NestJS (modular architecture)
- MongoDB via Mongoose
- JWT for auth
- Jest + Supertest for tests


## Quick start
1. Clone the repo

2. Install dependencies

```bash
pnpm install
```

3. Create a `.env` file in the project root (see Environment Variables below)

4. Start the app in development

```bash
pnpm run start:dev
```

The server will start on PORT (default 3000). The root route (`GET /`) returns a simple "Hello World!" message.


## Environment variables
Create a `.env` file in the project root with at least the following values:

```env
PORT=3000
MONGODB_URL=mongodb://localhost:-----
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

Notes:
- `MONGODB_URL` is used by `MongooseModule.forRoot(...)` in `AppModule`.
- `JWT_SECRET` is used by the `JwtModule` in `AuthModule` and by the custom `AuthGuard`.


## Available scripts (from package.json)
- pnpm run build — build the project (nest build)
- pnpm run start — start the built app
- pnpm run start:dev — run in watch mode (development)
- pnpm run start:prod — run production build (node dist/main)
- pnpm run lint — run eslint
- pnpm run format — format code with Prettier
- pnpm run test — run unit tests (jest)
- pnpm run test:e2e — run e2e tests
- pnpm run test:cov — coverage


## API summary
All endpoints are relative to the API root (e.g., http://localhost:3000)

Root
- GET / => returns a simple string ("Hello World!")

Auth (prefix: `/auth`)
- POST /auth/register
  - Body: RegisterDto { fname, lname, email, password }
  - Registers a user, returns { access_token }
- POST /auth/login
  - Body: LoginDto { email, password }
  - Returns { access_token }
- GET /auth/profile
  - Protected (Bearer token). Returns basic user info: { id, fname, lname, email }

Courses (prefix: `/courses`)
- GET /courses
  - Public: returns all courses
- GET /courses/:id
  - Public: returns a single course by id
- POST /courses
  - Protected, Admin only: Create a course
  - Body: CreateCourseDto { name, description, level, price }
- PATCH /courses/:id
  - Protected, Admin only: Update a course (partial body allowed)
- DELETE /courses/:id
  - Protected, Admin only: Delete a course

Auth & Roles
- The project uses a custom `AuthGuard` which verifies JWT tokens from the `Authorization: Bearer <token>` header.
- Role-based authorization leverages a `Roles` decorator and `RolesGuard` (controllers use `@Roles(Role.Admin)` for Admin-only actions).
- Roles available: `admin`, `student` (see `src/user/types/user.types.ts`).


## Data models & DTOs (summary)
User (schema: `src/user/schemas/userSchema.ts`)
- fname: string (required)
- lname: string (required)
- email: string (required, unique)
- password: string (required, hashed before storage)
- role: string (default: `student`)

Course (schema: `src/course/schemas/course.schema.ts`)
- name: string (required)
- description: string (required)
- level: string (required)
- price: number (required)

DTOs validate incoming requests using `class-validator`:
- RegisterDto: fname, lname, email (email), password
- LoginDto: email, password
- CreateCourseDto: name, description, level, price (price is number)
- UpdateCourseDto: PartialType(CreateCourseDto) — partial updates allowed


## Examples (curl)
Register a user

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fname":"Alice","lname":"Doe","email":"alice@example.com","password":"secret"}'
```

Login to get a token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret"}'
```

Use the returned access_token for protected endpoints (replace <TOKEN> below):

Get profile

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/auth/profile
```

Create a course (Admin only)

```bash
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"name":"Intro to NestJS","description":"Learn Nest","level":"beginner","price":99}'
```


## Tests
- Unit tests: `pnpm run test`
- E2E tests: `pnpm run test:e2e`

See `jest` section in `package.json` for configuration.


## Contributing
- Follow the existing code style (Prettier + ESLint). Run `pnpm run format` and `pnpm run lint` before submitting PRs.
- Add tests for new functionality.
- Open an issue first if the change is significant.


## Troubleshooting
- If Mongo connection fails, ensure `MONGODB_URL` is set and MongoDB is running.
- If JWT verification fails, make sure `JWT_SECRET` in `.env` matches the secret used when generating tokens.
- Use `pnpm run start:dev` for live reload and easier debugging.


## Next steps & suggestions
- Add Swagger/OpenAPI docs with `@nestjs/swagger` for automatic API docs.
- Add a CI workflow (GitHub Actions) to run tests and lint on PRs.
- Add more unit and e2e tests and example Postman collection.


## License
This project currently declares `UNLICENSED` in `package.json`. Check `package.json` or add a proper LICENSE file if you plan to open-source it.


---

If you want, I can also:
- generate a Postman collection or OpenAPI spec from the controllers,
- add a `.env.example` file,
- wire up Swagger endpoints,
- or expand the README with an exhaustive API reference (fields, response examples) — tell me which you'd prefer.
