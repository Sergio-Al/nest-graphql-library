import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String, { description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String, { description: 'Password of the user' })
  @MinLength(8)
  password: string;
}
