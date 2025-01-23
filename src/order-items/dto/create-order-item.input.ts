import { InputType, Int, Field, Float, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateOrderItemInput {
  @Field(() => Int, { description: 'Quantity of the book' })
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @Field(() => Float, { description: 'Unit price of the book', nullable: true })
  @IsOptional()
  unit_price?: number;

  @Field(() => ID, { description: 'Order to which the item belongs' })
  @IsUUID()
  order_id: string;

  @Field(() => ID, { description: 'Book in the order item' })
  @IsUUID()
  book_id: string;
}
