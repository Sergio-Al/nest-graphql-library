import { forwardRef, Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsResolver } from './reviews.resolver';
import { Review } from './entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';

@Module({
  providers: [ReviewsResolver, ReviewsService],
  imports: [TypeOrmModule.forFeature([Review]), UsersModule, BooksModule],
  exports: [TypeOrmModule, ReviewsService],
})
export class ReviewsModule {}
