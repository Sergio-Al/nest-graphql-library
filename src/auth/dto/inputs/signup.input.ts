import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String, { description: 'Password of the user' })
  @MinLength(8)
  password: string;

  @Field(() => String, { description: 'First name of the user' })
  @IsNotEmpty()
  first_name: string;

  @Field(() => String, { description: 'Last name of the user' })
  @IsNotEmpty()
  last_name: string;
}
