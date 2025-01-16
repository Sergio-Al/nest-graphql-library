import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';

@Module({
  providers: [BooksResolver, BooksService],
  imports: [TypeOrmModule.forFeature([Book])],
})
export class BooksModule {}
