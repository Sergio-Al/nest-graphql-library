import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Review)
@UseGuards(JwtAuthGuard)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(() => Review, {
    name: 'createReview',
    description: `Roles allowed: ${ValidRoles.user} This mutation is used to create a new review`,
  })
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @CurrentUser([ValidRoles.user]) user: User,
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

  @Mutation(() => Review, {
    name: 'updateReview',
    description: `Roles allowed: ${ValidRoles.user} This mutation is used to update a review`,
  })
  updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
    @CurrentUser([ValidRoles.user]) user: User,
  ): Promise<Review> {
    return this.reviewsService.update(updateReviewInput.id, updateReviewInput);
  }

  @Mutation(() => Review, {
    name: 'removeReview',
    description: `Roles allowed: ${ValidRoles.user} This mutation is used to remove a review`,
  })
  removeReview(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.user]) user: User,
  ): Promise<Review> {
    return this.reviewsService.remove(id);
  }
}
