import { Module } from '@nestjs/common';
import { UserFavoritesService } from './user-favorites.service';
import { UserFavoritesResolver } from './user-favorites.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFavorite } from './entities/user-favorite.entity';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';

@Module({
  providers: [UserFavoritesResolver, UserFavoritesService],
  imports: [TypeOrmModule.forFeature([UserFavorite]), UsersModule, BooksModule],
  exports: [UserFavoritesService],
})
export class UserFavoritesModule {}
