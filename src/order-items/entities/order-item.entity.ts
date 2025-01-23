import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Book } from 'src/books/entities/book.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order_items' })
@ObjectType()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Unique identifier for the order item' })
  id: string;

  @Field(() => Int, { description: 'Quantity of the book' })
  @Column('int')
  quantity: number;

  @Field(() => Float, { description: 'Unit price of the book' })
  @Column('decimal', { precision: 10, scale: 2 })
  unit_price: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { lazy: true })
  @Field(() => Order, { description: 'Order to which the item belongs' })
  order: Order;

  @ManyToOne(() => Book, (book) => book.orderItems, { lazy: true })
  @Field(() => Book, { description: 'Book in the order item' })
  book: Book;
}
