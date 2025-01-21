import { IsUUID } from 'class-validator';
import { CreateAuthorInput } from './create-author.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateAuthorInput extends PartialType(CreateAuthorInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
