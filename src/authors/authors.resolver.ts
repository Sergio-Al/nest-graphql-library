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
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Resolver(() => Author)
@UseGuards(JwtAuthGuard)
export class AuthorsResolver {
  constructor(private readonly authorsService: AuthorsService) {}

  @Mutation(() => Author, {
    description: 'Create a new author, requires a Admin Role',
  })
  createAuthor(
    @Args('createAuthorInput') createAuthorInput: CreateAuthorInput,
    @CurrentUser([ValidRoles.admin]) user: User,
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

  @Mutation(() => Author, {
    description: 'Update an author, requires a Admin Role',
  })
  updateAuthor(
    @Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<Author> {
    return this.authorsService.update(updateAuthorInput.id, updateAuthorInput);
  }

  @Mutation(() => Author, {
    description: 'Remove an author, requires a Admin Role',
  })
  removeAuthor(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<Author> {
    return this.authorsService.remove(id);
  }

  @ResolveField(() => Number, {
    name: 'totalAuthors',
    description: 'Total number of authors',
  })
  totalAuthors(): Promise<number> {
    return this.authorsService.totalAuthors();
  }
}
