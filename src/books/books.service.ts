import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
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

  async findOne(id: string): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id, deleted: false },
    });

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

  // async addAuthorToBook(bookId: string, authorId: string): Promise<Book> {
  //   const book = await this.booksRepository.findOne({
  //     where: { id: bookId },
  //     relations: ['authors'],
  //   });

  //   const author = await this.authorsRepository.findOneBy({ id: authorId });

  //   if (!book.authors) {
  //     book.authors = [];
  //   }

  //   book.authors.push(author);
  //   return this.booksRepository.save(book);
  // }

  // async findBookWithAuthors(id: string): Promise<Book> {
  //   return this.booksRepository.findOne({
  //     where: { id },
  //     relations: ['authors'],
  //   });
  // }

  async totalBooks(): Promise<number> {
    return this.booksRepository.count();
  }
}
