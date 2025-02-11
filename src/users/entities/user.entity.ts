import {
  ObjectType,
  Field,
  Int,
  ID,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { Order } from 'src/orders/entities/order.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { UserFavorite } from 'src/user-favorites/entities/user-favorite.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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
  @Field(() => [ValidRoles], {
    description: `Available roles:
  • user (default)
  • admin
  • guest
  • super-admin

  Users can have multiple roles.`,
  })
  role: ValidRoles[];

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

  @OneToMany(() => UserFavorite, (favorite) => favorite.user, { lazy: true })
  @Field(() => [UserFavorite], {
    description: 'List of user favorites',
    defaultValue: [],
  })
  favorites: UserFavorite[];

  @OneToMany(() => Review, (review) => review.user, { lazy: true })
  @Field(() => [Review], {
    description: 'List of user reviews',
    defaultValue: [],
  })
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.user, { lazy: true })
  @Field(() => [Order], {
    description: 'List of user orders',
    defaultValue: [],
  })
  orders: Order[];
}
