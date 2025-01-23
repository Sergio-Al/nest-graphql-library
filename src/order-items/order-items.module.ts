import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsResolver } from './order-items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { BooksModule } from 'src/books/books.module';

@Module({
  providers: [OrderItemsResolver, OrderItemsService],
  imports: [TypeOrmModule.forFeature([OrderItem]), OrdersModule, BooksModule],
  exports: [TypeOrmModule, OrderItemsService],
})
export class OrderItemsModule {}
