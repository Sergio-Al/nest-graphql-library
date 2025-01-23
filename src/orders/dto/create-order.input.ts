import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, isNotEmpty, IsUUID } from 'class-validator';
import { ValidStatuses } from '../enums/valid-statuses.enum';

@InputType()
export class CreateOrderInput {
  @Field(() => ValidStatuses, { description: 'User status' })
  @IsNotEmpty()
  status: string;

  @Field(() => Float, { description: 'Total amount of the order' })
  @IsNotEmpty()
  total_amount: number;

  @Field(() => String, { description: 'User who placed the order' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
