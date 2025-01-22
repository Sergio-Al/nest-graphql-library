import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AddBookCategoryInput {
  @Field(() => ID, { description: 'The id of the book' })
  @IsUUID()
  bookId: string;

  @Field(() => [ID], { description: 'The id of the category' })
  @IsUUID('4', { each: true })
  categoryIds: string[];
}
