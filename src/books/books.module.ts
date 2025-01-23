import { forwardRef, Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { AuthorsModule } from 'src/authors/authors.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  providers: [BooksResolver, BooksService],
  imports: [TypeOrmModule.forFeature([Book]), AuthorsModule, CategoriesModule],
  exports: [TypeOrmModule, BooksService],
})
export class BooksModule {}
