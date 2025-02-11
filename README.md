# NestJS GraphQL Library API

A GraphQL API for managing a library system built with NestJS, TypeORM, and PostgreSQL.

## Features

- 📚 Book management with authors and categories
- 👥 User authentication and authorization
- 🛒 Order processing system
- ⭐ Review and rating system
- 🔖 User favorites functionality

## Tech Stack

- NestJS
- GraphQL
- TypeORM
- PostgreSQL
- JWT Authentication
- Docker

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn
- Docker

## Installation

```bash
# Clone repository
git clone https://github.com/Sergio-Al/nest-graphql-library.git

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start PostgreSQL database
docker-compose up -d

# Start development server
npm run start:dev

```

## Usage

- Open [http://localhost:3000/graphql](http://localhost:3000/graphql) in your browser to access the GraphQL playground.

### GraphQL Examples

#### Sign Up Mutation Query

```graphql
mutation Signup($signupInput: SignupInput!) {
  signup(signupInput: $signupInput) {
    token
    user {
      id
      last_name
      email
      created_at
      first_name
      role
      totalUsers
      updated_at
    }
  }
}
```

#### Sign Up Mutation Variables

```json
{
  "signupInput": {
    "email": "usertestexample@examplec.om",
    "first_name": "John",
    "last_name": "Doe",
    "password": "MySecretPass1234"
  }
}
```

- User role can be either `user`, `admin`, `guest` or `super-admin`. The default role is `user` but can be changed in the database.

- With the token returned from the signup mutation, you can make authenticated requests by adding the token to the HTTP headers.

- The token should be added to the `Authorization` header with the value `Bearer <token>`. For example:

```json
{
  "Authorization" : "Bearer <token>"
}
```

#### Login Mutation Query

```graphql
mutation Mutation($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    token
    user {
      id
      first_name
      last_name
    }
  }
}
```

#### Login Mutation Variables

```json
{
  "loginInput": {
    "email": "usertestexample@example.com",
    "password": "MySecretPass1234"
  }
}
```

#### Get Books

```graphql
query Query {
  books {
    id
    title
  }
}
``` 
- You can also get books with more details by adding more fields to the query.

## Project Structure

```
src/
├── auth/         # Authentication
├── books/        # Book management
├── authors/      # Author management
├── categories/   # Category management
├── orders/       # Order processing
├── reviews/      # Review system
└── users/        # User management
```

## License

This project is open source and available under the [MIT License](LICENSE).

