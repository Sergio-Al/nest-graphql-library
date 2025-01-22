import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { AddBookAuthorInput } from './dto/add-book-author.input';
import { AuthorsService } from 'src/authors/authors.service';
import { AddBookCategoryInput } from './dto/add-book-category.input';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    private readonly authorsService: AuthorsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createBookInput: CreateBookInput): Promise<Book> {
    const newBook = this.booksRepository.create(createBookInput);
    return await this.booksRepository.save(newBook);
  }

  async findAll(): Promise<Book[]> {
    const queryBuilder = this.booksRepository
      .createQueryBuilder('book')
      .where('book.deleted = :deleted', { deleted: false });
    return queryBuilder.getMany();
  }

  async findOne(id: string, relations: string[] = []): Promise<Book> {
    const findOptions = { where: { id, deleted: false } };

    if (relations.length > 0) {
      findOptions['relations'] = relations;
    }

    const book = await this.booksRepository.findOne(findOptions);

    if (!book) {
      throw new NotFoundException(`Book #${id} not found`);
    }

    return book;
  }

  async update(id: string, updateBookInput: UpdateBookInput): Promise<Book> {
    try {
      const book = await this.booksRepository.preload({
        ...updateBookInput,
        id,
      });

      if (!book) {
        throw new NotFoundException(`Book #${id} not found`);
      }

      return await this.booksRepository.save(book);
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string): Promise<Book> {
    const book = await this.findOne(id);
    book.deleted = true;
    await this.booksRepository.save(book);

    return book;
  }

  async addAuthorsToBook(input: AddBookAuthorInput): Promise<Book> {
    const book = await this.findOne(input.bookId, ['authors']);

    if (!book.authors) {
      book.authors = [];
    }

    const currentAuthors = await book.authors;

    const newAuthors = await this.authorsService.findAuthorsByIds(
      input.authorIds,
    );

    if (newAuthors.length === 0) {
      throw new NotFoundException('Authors not found');
    }

    const existingAuthorIds = currentAuthors.map((author) => author.id);
    const uniqueNewAuthors = newAuthors.filter(
      (author) => !existingAuthorIds.includes(author.id),
    );

    book.authors = [...currentAuthors, ...uniqueNewAuthors];

    return this.booksRepository.save(book);
  }

  async addCategoriesToBook(input: AddBookCategoryInput): Promise<Book> {
    const book = await this.findOne(input.bookId, ['categories']);

    if (!book.categories) {
      book.categories = [];
    }

    const currentCategories = await book.categories;
    const newCategories = await this.categoriesService.findCategoriesByIds(
      input.categoryIds,
    );

    if (newCategories.length === 0) {
      throw new NotFoundException('Categories not found');
    }

    const existingCategoryIds = currentCategories.map(
      (category) => category.id,
    );
    const uniqueNewCategories = newCategories.filter(
      (category) => !existingCategoryIds.includes(category.id),
    );
    book.categories = [...currentCategories, ...uniqueNewCategories];
    return this.booksRepository.save(book);
  }

  async totalBooks(): Promise<number> {
    return this.booksRepository.count();
  }
}
