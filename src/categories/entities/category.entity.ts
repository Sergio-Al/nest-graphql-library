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

@Entity({ name: 'categories' })
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, {
    description: 'This is the primary id of the categories entity',
  })
  id: string;

  @Column()
  @Field(() => ID, { description: 'The name of the category' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, {
    description: 'The description of the category',
    nullable: true,
  })
  description?: string;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime, {
    description: 'The date the category was created',
  })
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @ManyToMany(() => Book, (book) => book.categories, { lazy: true })
  @Field(() => [Book], { description: 'The books related to the category' })
  books: Book[];
}
