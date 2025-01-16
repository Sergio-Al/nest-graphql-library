import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateBookInput {
  @Field(() => String, {
    description: 'Title of the book',
  })
  @IsNotEmpty()
  title: string;

  @Field(() => String, {
    description: 'Author of the book',
  })
  @IsNotEmpty()
  isbn: string;

  @Field(() => String, {
    description: 'Description of the book',
  })
  @IsNotEmpty()
  description: string;

  @Field(() => Int, {
    description: 'Publication year of the book',
  })
  @IsNotEmpty()
  publication_year: number;

  @Field(() => Number, {
    description: 'Price of the book',
  })
  @IsNotEmpty()
  price: number;

  @Field(() => Int, {
    description: 'Stock of the book',
  })
  @IsNotEmpty()
  stock: number;
}
