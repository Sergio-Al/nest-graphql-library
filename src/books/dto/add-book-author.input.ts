import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AddBookAuthorInput {
  @Field(() => ID, { description: 'The id of the book' })
  @IsUUID()
  bookId: string;

  @Field(() => [ID], { description: 'The id of the author' })
  @IsUUID('4', { each: true })
  authorIds: string[];
}
