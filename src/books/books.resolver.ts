import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  ID,
  Parent,
} from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { AddBookAuthorInput } from './dto/add-book-author.input';
import { AddBookCategoryInput } from './dto/add-book-category.input';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Mutation(() => Book)
  createBook(
    @Args('createBookInput') createBookInput: CreateBookInput,
  ): Promise<Book> {
    return this.booksService.create(createBookInput);
  }

  @Query(() => [Book], { name: 'books' })
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Query(() => Book, { name: 'book' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Mutation(() => Book)
  updateBook(
    @Args('updateBookInput') updateBookInput: UpdateBookInput,
  ): Promise<Book> {
    return this.booksService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => Book)
  removeBook(@Args('id', { type: () => ID }) id: string): Promise<Book> {
    return this.booksService.remove(id);
  }

  @Mutation(() => Book)
  addAuthorsToBook(@Args('input') input: AddBookAuthorInput): Promise<Book> {
    return this.booksService.addAuthorsToBook(input);
  }

  @Mutation(() => Book)
  addCategoriesToBook(
    @Args('input') input: AddBookCategoryInput,
  ): Promise<Book> {
    return this.booksService.addCategoriesToBook(input);
  }

  @ResolveField(() => Number, { name: 'totalBooks' })
  totalBooks(): Promise<number> {
    return this.booksService.totalBooks();
  }
}
