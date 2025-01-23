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
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'reviews' })
@ObjectType()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, {
    description: 'Unique identifier for the review',
    complexity: 1,
  })
  id: string;

  @Column({ type: 'int' })
  @Field(() => Int, {
    description: 'Rating of the review',
  })
  rating: number;

  @Column({ type: 'text' })
  @Field(() => String, {
    description: 'Content of the review',
  })
  content: string;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean, {
    description: 'Flag to indicate if the review is active',
  })
  deleted: boolean;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime, {
    description: 'Date when the review was created',
  })
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime, {
    description: 'Date when the review was last updated',
  })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.reviews, { lazy: true })
  @Field(() => User, {
    description: 'User that created the review',
  })
  user: User;

  @ManyToOne(() => Book, (book) => book.reviews, { lazy: true })
  @Field(() => Book, {
    description: 'Book that was reviewed',
  })
  book: Book;
}
