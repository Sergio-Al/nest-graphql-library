import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ): Promise<Review> {
    return this.reviewsService.create(createReviewInput);
  }

  @Query(() => [Review], { name: 'reviews' })
  findAll(): Promise<Review[]> {
    return this.reviewsService.findAll();
  }

  @Query(() => Review, { name: 'review' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Review> {
    return this.reviewsService.findOne(id);
  }

  @Mutation(() => Review)
  updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
  ): Promise<Review> {
    return this.reviewsService.update(updateReviewInput.id, updateReviewInput);
  }

  @Mutation(() => Review)
  removeReview(@Args('id', { type: () => ID }) id: string): Promise<Review> {
    return this.reviewsService.remove(id);
  }
}
