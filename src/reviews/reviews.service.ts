import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReviewsService {
  private logger: Logger = new Logger('ReviewsService');

  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly usersService: UsersService,
    private readonly booksService: BooksService,
  ) {}

  async create(createReviewInput: CreateReviewInput): Promise<Review> {
    const newReview = this.reviewsRepository.create(createReviewInput);
    newReview.user = await this.usersService.findOne(createReviewInput.userId);
    newReview.book = await this.booksService.findOne(createReviewInput.bookId);
    return await this.reviewsRepository.save(newReview);
  }

  async findAll(): Promise<Review[]> {
    const queryBuilder = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.book', 'book')
      .where('review.deleted = :deleted', { deleted: false });

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id, deleted: false },
    });

    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }

    return review;
  }

  async update(
    id: string,
    updateReviewInput: UpdateReviewInput,
  ): Promise<Review> {
    await this.findOne(id);
    const review = await this.reviewsRepository.preload({
      ...updateReviewInput,
      id,
    });

    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }

    return await this.reviewsRepository.save(review);
  }

  async remove(id: string): Promise<Review> {
    const review = await this.findOne(id);
    review.deleted = true;
    return await this.reviewsRepository.save(review);
  }

  async totalReviews(): Promise<number> {
    return this.reviewsRepository.count({
      where: {
        deleted: false,
      },
    });
  }

  async activeReviewsByBookId(bookId: string): Promise<Review[]> {
    return this.reviewsRepository
      .createQueryBuilder('review')
      .where('review.deleted = :deleted', { deleted: false })
      .andWhere('review.bookId = :bookId', { bookId })
      .getMany();
  }

  private handleDBErrors(error: any) {
    this.logger.error(error.message, error.stack);
    if (error.code === '23503') {
      throw new NotFoundException('Invalid user or book');
    }
    throw new Error('Internal server error');
  }
}
