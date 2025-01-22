import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserFavoriteInput } from './dto/create-user-favorite.input';
import { UpdateUserFavoriteInput } from './dto/update-user-favorite.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFavorite } from './entities/user-favorite.entity';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserFavoritesService {
  constructor(
    @InjectRepository(UserFavorite)
    private readonly userFavoritesRepository: Repository<UserFavorite>,
    private readonly usersService: UsersService,
    private readonly booksService: BooksService,
  ) {}

  async addFavorite(
    createUserFavoriteInput: CreateUserFavoriteInput,
  ): Promise<UserFavorite> {
    const user = await this.usersService.findOne(
      createUserFavoriteInput.userId,
    );

    const book = await this.booksService.findOne(
      createUserFavoriteInput.bookId,
    );

    const newFavorite = this.userFavoritesRepository.create({
      user,
      book,
    });
    return await this.userFavoritesRepository.save(newFavorite);
  }

  async removeFavorite(id: string): Promise<boolean> {
    const favorite = await this.userFavoritesRepository.findOne({
      where: {
        id,
      },
    });
    if (!favorite) {
      throw new NotFoundException(`Favorite #${id} not found`);
    }
    await this.userFavoritesRepository.delete(id);
    return true;
  }
}
