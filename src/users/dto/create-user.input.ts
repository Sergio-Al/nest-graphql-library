import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

// Users {
//   uuid id PK
//   string email
//   string password_hash
//   string first_name
//   string last_name
//   enum role
//   timestamp created_at
//   timestamp updated_at
// }
@InputType()
export class CreateUserInput {
  @Field(() => String, {
    description: 'Email of the user',
  })
  @IsNotEmpty()
  email: string;

  @Field(() => String, {
    description: 'Password of the user',
  })
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @Field(() => String, {
    description: 'First name of the user',
  })
  @IsNotEmpty()
  first_name: string;

  @Field(() => String, {
    description: 'Last name of the user',
  })
  @IsNotEmpty()
  last_name: string;
}
