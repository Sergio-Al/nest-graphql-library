import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'The name of the category' })
  @IsNotEmpty()
  name: string;

  @Field(() => String, {
    description: 'The description of the category',
    nullable: true,
  })
  @IsOptional()
  description?: string;
}
