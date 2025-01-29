import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Category)
@UseGuards(JwtAuthGuard)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category, {
    name: 'createCategory',
    description: `Roles allowed: ${ValidRoles.admin} This mutation is used to create a new category`,
  })
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Mutation(() => Category, {
    name: 'updateCategory',
    description: `Roles allowed: ${ValidRoles.admin} This mutation is used to update a category`,
  })
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<Category> {
    return this.categoriesService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Mutation(() => Category, {
    name: 'removeCategory',
    description: `Roles allowed: ${ValidRoles.admin} This mutation is used to remove a category`,
  })
  removeCategory(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<Category> {
    return this.categoriesService.remove(id);
  }
}
