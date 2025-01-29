import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UserFavoritesService } from './user-favorites.service';
import { UserFavorite } from './entities/user-favorite.entity';
import { CreateUserFavoriteInput } from './dto/create-user-favorite.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => UserFavorite)
@UseGuards(JwtAuthGuard)
export class UserFavoritesResolver {
  constructor(private readonly userFavoritesService: UserFavoritesService) {}

  @Mutation(() => UserFavorite, {
    name: 'addUserFavorite',
    description: `Roles allowed: ${ValidRoles.user} This mutation is used to add a favorite`,
  })
  addUserFavorite(
    @Args('createUserFavoriteInput')
    createUserFavoriteInput: CreateUserFavoriteInput,
    @CurrentUser([ValidRoles.user]) user: User,
  ): Promise<UserFavorite> {
    return this.userFavoritesService.addFavorite(createUserFavoriteInput);
  }

  @Mutation(() => Boolean, {
    name: 'removeUserFavorite',
    description: `Roles allowed: ${ValidRoles.user} This mutation is used to remove a favorite`,
  })
  removeUserFavorite(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.user]) user: User,
  ): Promise<boolean> {
    return this.userFavoritesService.removeFavorite(id);
  }
}
