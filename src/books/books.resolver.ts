import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  ID,
} from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';

import { BooksService } from './books.service';
import { Book } from './entities/book.entity';

import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { AddBookAuthorInput } from './dto/add-book-author.input';
import { AddBookCategoryInput } from './dto/add-book-category.input';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

import { User } from 'src/users/entities/user.entity';

@Resolver(() => Book)
@UseGuards(JwtAuthGuard)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Mutation(() => Book, {
    name: 'createBook',
    description: 'Create a new book, requires a Admin Role',
  })
  createBook(
    @Args('createBookInput') createBookInput: CreateBookInput,
    @CurrentUser([ValidRoles.admin]) user: User,
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

  @Mutation(() => Book, {
    name: 'updateBook',
    description: 'Update a book, requires a Admin Role',
  })
  updateBook(
    @Args('updateBookInput') updateBookInput: UpdateBookInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<Book> {
    return this.booksService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => Book, {
    name: 'removeBook',
    description: 'Remove a book, requires a Admin Role',
  })
  removeBook(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Book> {
    return this.booksService.remove(id);
  }

  @Mutation(() => Book, {
    name: 'addAuthorsToBook',
    description: 'Add authors to a book, requires a Admin Role',
  })
  addAuthorsToBook(
    @Args('input') input: AddBookAuthorInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<Book> {
    return this.booksService.addAuthorsToBook(input);
  }

  @Mutation(() => Book, {
    name: 'addCategoriesToBook',
    description: 'Add categories to a book, requires a Admin Role',
  })
  addCategoriesToBook(
    @Args('input') input: AddBookCategoryInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<Book> {
    return this.booksService.addCategoriesToBook(input);
  }

  @ResolveField(() => Number, {
    name: 'totalBooks',
    description: 'Total number of books',
  })
  totalBooks(): Promise<number> {
    return this.booksService.totalBooks();
  }
}
