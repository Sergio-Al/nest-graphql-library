import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UserFavoritesService } from './user-favorites.service';
import { UserFavorite } from './entities/user-favorite.entity';
import { CreateUserFavoriteInput } from './dto/create-user-favorite.input';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => UserFavorite)
export class UserFavoritesResolver {
  constructor(private readonly userFavoritesService: UserFavoritesService) {}

  @Mutation(() => UserFavorite)
  addUserFavorite(
    @Args('createUserFavoriteInput')
    createUserFavoriteInput: CreateUserFavoriteInput,
  ): Promise<UserFavorite> {
    return this.userFavoritesService.addFavorite(createUserFavoriteInput);
  }

  @Mutation(() => Boolean)
  removeUserFavorite(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<boolean> {
    return this.userFavoritesService.removeFavorite(id);
  }
}
