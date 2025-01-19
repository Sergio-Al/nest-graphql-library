import {
  ObjectType,
  Field,
  Int,
  ID,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, {
    description: 'Unique identifier for the user',
  })
  id: string;

  @Column()
  @Field(() => String, {
    description: 'Email of the user',
  })
  email: string;

  @Column()
  password: string;

  @Column()
  @Field(() => String, {
    description: 'First name of the user',
  })
  first_name: string;

  @Column()
  @Field(() => String, {
    description: 'Last name of the user',
  })
  last_name: string;

  @Column({ type: 'text', array: true, default: ['user'] })
  @Field(() => [String], {
    description: 'Role of the user',
  })
  role: string;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime, {
    description: 'Date when the user was created',
  })
  created_at: Date;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime, {
    description: 'Date when the user was last updated',
  })
  updated_at: Date;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;
}
