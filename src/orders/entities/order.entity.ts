import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ObjectType,
  Field,
  Int,
  ID,
  Float,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { User } from 'src/users/entities/user.entity';

// Orders {
//   uuid id PK
//   uuid user_id FK
//   enum status
//   decimal total_amount
//   timestamp order_date
//   timestamp updated_at
// }

@Entity({ name: 'orders' })
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Unique identifier for the order' })
  id: string;

  @Column('text')
  @Field(() => String, { description: 'User status' })
  status: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @Field(() => Float, {
    description: 'Total amount of the order',
    nullable: true,
  })
  total_amount?: number;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime, {
    description: 'Date when the order was created',
  })
  order_date: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime, {
    description: 'Date when the order was last updated',
  })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.orders, { lazy: true })
  @Field(() => User, {
    description: 'User who placed the order',
  })
  user: User;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean, {
    description: 'Flag to determine if the order was deleted',
  })
  deleted: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { lazy: true })
  @Field(() => [OrderItem], {
    description: 'Items in the order',
  })
  orderItems: OrderItem[];
}
