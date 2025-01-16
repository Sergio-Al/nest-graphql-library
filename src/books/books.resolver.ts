import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  ID,
} from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Mutation(() => Book)
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.booksService.create(createBookInput);
  }

  @Query(() => [Book], { name: 'books' })
  findAll() {
    return this.booksService.findAll();
  }

  @Query(() => Book, { name: 'book' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.booksService.findOne(id);
  }

  @Mutation(() => Book)
  updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.booksService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => Book)
  removeBook(@Args('id', { type: () => ID }) id: string) {
    return this.booksService.remove(id);
  }

  @ResolveField(() => Number, { name: 'totalBooks' })
  totalBooks() {
    return this.booksService.totalBooks();
  }
}
