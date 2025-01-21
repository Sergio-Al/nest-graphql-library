import { InputType, Int, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Authors {
//   uuid id PK
//   string name
//   text biography
//   date birth_date
//   string nationality
//   timestamp created_at
// }

@InputType()
export class CreateAuthorInput {
  @Field(() => String, { description: 'name of the author' })
  @IsNotEmpty()
  name: string;

  @Field(() => String, {
    description: 'biography of the author',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  biography?: string;

  @Field(() => String, {
    description: 'Nationality of the author',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  nationality?: string;

  @Field(() => GraphQLISODateTime, {
    description: 'birth date of the author',
    nullable: true,
  })
  @IsOptional()
  birth_date?: Date;
}
