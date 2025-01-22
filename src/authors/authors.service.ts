import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { Author } from './entities/author.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class AuthorsService {
  private logger: Logger = new Logger('AuthorsService');

  constructor(
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
  ) {}

  async create(createAuthorInput: CreateAuthorInput): Promise<Author> {
    console.log(createAuthorInput);
    const newAuthor = this.authorsRepository.create(createAuthorInput);
    return await this.authorsRepository.save(newAuthor);
  }

  async findAll(): Promise<Author[]> {
    const queryBuilder = this.authorsRepository
      .createQueryBuilder('author')
      .where('author.deleted = :deleted', { deleted: false });

    const authors = await queryBuilder.getMany();

    authors.forEach((author) => {
      if (author.birth_date) {
        author.birth_date = new Date(author.birth_date);
      }
    });

    return authors;
  }

  async findAuthorsByIds(ids: string[]): Promise<Author[]> {
    const authors = await this.authorsRepository.find({
      where: {
        id: In([...ids]),
        deleted: false,
      },
    });

    authors.forEach((author) => {
      if (author.birth_date) {
        author.birth_date = new Date(author.birth_date);
      }
    });

    return authors;
  }

  async findOne(id: string): Promise<Author> {
    try {
      const author = await this.authorsRepository.findOneByOrFail({
        id,
        deleted: false,
      });

      console.log('this is the author', author);

      if (!author) {
        throw new NotFoundException(`Author #${id} not found`);
      }

      if (author.birth_date) {
        author.birth_date = new Date(author.birth_date);
      }

      return author;
    } catch (error) {
      this.handleDBErrors({
        code: 'error--001',
        detail: `Author with id ${id} not found`,
      });
    }
  }

  async update(
    id: string,
    updateAuthorInput: UpdateAuthorInput,
  ): Promise<Author> {
    const author = await this.authorsRepository.preload({
      ...updateAuthorInput,
      id,
    });

    if (!author) {
      throw new NotFoundException(`Author #${id} not found`);
    }

    const updatedAuthor = await this.authorsRepository.save(author);

    if (updatedAuthor.birth_date) {
      updatedAuthor.birth_date = new Date(updatedAuthor.birth_date);
    }
    return updatedAuthor;
  }

  async remove(id: string): Promise<Author> {
    const author = await this.findOne(id);
    author.deleted = true;
    await this.authorsRepository.save(author);

    return author;
  }

  async totalAuthors(): Promise<number> {
    return this.authorsRepository.count({
      where: {
        deleted: false,
      },
    });
  }

  private handleDBErrors(error: any) {
    this.logger.error(error);
    if (error.code === '23505') {
      throw new Error('Duplicated field');
    }
    if (error.code === 'error--001') {
      throw new NotFoundException(error.detail);
    }

    throw new Error('Internal server error');
  }
}
