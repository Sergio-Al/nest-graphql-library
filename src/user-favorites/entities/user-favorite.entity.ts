import {
  ObjectType,
  Field,
  Int,
  ID,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user_favorites' })
@ObjectType()
export class UserFavorite {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => User, (user) => user.favorites, { lazy: true })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Book, (book) => book.favorited, { lazy: true })
  @Field(() => Book)
  book: Book;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  added_at: Date;
}
