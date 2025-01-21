import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ID,
  ResolveField,
} from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { Author } from './entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private readonly authorsService: AuthorsService) {}

  @Mutation(() => Author)
  createAuthor(
    @Args('createAuthorInput') createAuthorInput: CreateAuthorInput,
  ): Promise<Author> {
    return this.authorsService.create(createAuthorInput);
  }

  @Query(() => [Author], { name: 'authors' })
  findAll(): Promise<Author[]> {
    return this.authorsService.findAll();
  }

  @Query(() => Author, { name: 'author' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Author> {
    return this.authorsService.findOne(id);
  }

  @Mutation(() => Author)
  updateAuthor(
    @Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput,
  ): Promise<Author> {
    return this.authorsService.update(updateAuthorInput.id, updateAuthorInput);
  }

  @Mutation(() => Author)
  removeAuthor(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Author> {
    return this.authorsService.remove(id);
  }

  @ResolveField(() => Number, { name: 'totalAuthors' })
  totalAuthors(): Promise<number> {
    return this.authorsService.totalAuthors();
  }
}
