import { IsUUID } from 'class-validator';
import { CreateBookInput } from './create-book.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
