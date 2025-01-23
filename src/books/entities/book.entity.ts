import {
  ObjectType,
  Field,
  Int,
  ID,
  GraphQLISODateTime,
  Float,
} from '@nestjs/graphql';
import { Author } from 'src/authors/entities/author.entity';
import { Category } from 'src/categories/entities/category.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { UserFavorite } from 'src/user-favorites/entities/user-favorite.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'books' })
@ObjectType()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, {
    description: 'Unique identifier for the book',
    complexity: 1,
  })
  id: string;

  @Column()
  @Field(() => String, {
    description: 'Title of the book',
  })
  title: string;

  @Column()
  @Field(() => String, {
    description: 'Author of the book',
  })
  isbn: string;

  @Column()
  @Field(() => String, {
    description: 'Description of the book',
  })
  description: string;

  @Column()
  @Field(() => Int, {
    description: 'Publication year of the book',
  })
  publication_year: number;

  @Column('float')
  @Field(() => Float, {
    description: 'Price of the book',
  })
  price: number;

  @Column()
  @Field(() => Int, {
    description: 'Stock of the book',
  })
  stock: number;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime, {
    description: 'Date when the book was created',
  })
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime, {
    description: 'Date when the book was last updated',
  })
  updated_at: Date;

  @ManyToMany(() => Author, (author) => author.books, { lazy: true })
  @JoinTable({
    name: 'book_authors',
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'author_id',
      referencedColumnName: 'id',
    },
  })
  @Field(() => [Author], {
    description: 'Authors of the book',
    defaultValue: [],
  })
  authors: Author[];

  @ManyToMany(() => Category, (category) => category.books, { lazy: true })
  @JoinTable({
    name: 'book_categories',
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  @Field(() => [Category], {
    description: 'Categories of the book',
    defaultValue: [],
  })
  categories: Category[];

  @OneToMany(() => UserFavorite, (favorite) => favorite.book, { lazy: true })
  @Field(() => [UserFavorite], {
    description: 'Users who favorited the book',
    defaultValue: [],
  })
  favorited: UserFavorite[];

  @OneToMany(() => Review, (review) => review.book, { lazy: true })
  @Field(() => [Review], {
    description: 'Reviews of the book',
    defaultValue: [],
  })
  reviews: Review[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.book, { lazy: true })
  @Field(() => [OrderItem], {
    description: 'Order items of the book',
    defaultValue: [],
  })
  orderItems: OrderItem[];
}
