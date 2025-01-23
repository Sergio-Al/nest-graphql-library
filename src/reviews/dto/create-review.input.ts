import { IsNotEmpty, IsUUID, Min } from 'class-validator';
import { InputType, Int, Field, ID } from '@nestjs/graphql';
// Reviews {
//   uuid id PK
//   uuid user_id FK
//   uuid book_id FK
//   int rating
//   text content
//   timestamp created_at
//   timestamp updated_at
// }
@InputType()
export class CreateReviewInput {
  @Field(() => Int, {
    description: 'Rating of the review',
  })
  @IsNotEmpty()
  @Min(0)
  rating: number;

  @Field(() => String, {
    description: 'Content of the review',
  })
  @IsNotEmpty()
  content: string;

  @Field(() => ID, {
    description: 'User that created the review',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Field(() => ID, {
    description: 'Book that is being reviewed',
  })
  @IsUUID()
  @IsNotEmpty()
  bookId: string;
}
