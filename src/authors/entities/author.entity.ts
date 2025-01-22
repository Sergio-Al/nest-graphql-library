import {
  ObjectType,
  Field,
  Int,
  ID,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { Book } from 'src/books/entities/book.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Authors {
//   uuid id PK
//   string name
//   text biography
//   date birth_date
//   string nationality
//   timestamp created_at
// }

@Entity({ name: 'authors' })
@ObjectType()
export class Author {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Example field (placeholder)' })
  id: string;

  @Column()
  @Field(() => String, { description: 'name of the author' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, {
    description: 'biography of the author',
    nullable: true,
  })
  biography?: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => GraphQLISODateTime, {
    description: 'birth date of the author',
    nullable: true,
  })
  birth_date?: Date;

  @Column({ nullable: true })
  @Field(() => String, {
    description: 'Nationality of the author',
    nullable: true,
  })
  nationality?: string;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime, {
    description: 'Date when the author was created',
  })
  created_at: Date;

  @ManyToMany(() => Book, (book) => book.authors, { lazy: true })
  @Field(() => [Book], { description: 'Books of the author' })
  books: Book[];
}
