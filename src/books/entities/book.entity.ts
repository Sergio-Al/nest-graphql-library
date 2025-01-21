import {
  ObjectType,
  Field,
  Int,
  ID,
  GraphQLISODateTime,
  Float,
} from '@nestjs/graphql';
import { Author } from 'src/authors/entities/author.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => Author, (author) => author.books)
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
}
