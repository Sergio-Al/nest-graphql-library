import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderItemInput } from './dto/create-order-item.input';
import { UpdateOrderItemInput } from './dto/update-order-item.input';
import { OrderItem } from './entities/order-item.entity';
import { Repository } from 'typeorm';
import { OrdersService } from 'src/orders/orders.service';
import { BooksService } from 'src/books/books.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly ordersService: OrdersService,
    private readonly booksService: BooksService,
  ) {}

  async create(createOrderItemInput: CreateOrderItemInput): Promise<OrderItem> {
    const book = await this.booksService.findOne(createOrderItemInput.book_id);

    if (book.stock < createOrderItemInput.quantity) {
      throw new BadRequestException('Not enough stock');
    }

    // Create the order item
    const newOrderItem = this.orderItemsRepository.create({
      ...createOrderItemInput,
      unit_price: book.price,
    });

    // Set relationships
    newOrderItem.book = book;
    newOrderItem.order = await this.ordersService.findOne(
      createOrderItemInput.order_id,
    );

    // Update the stock
    // await this.booksService.updateStock(
    //   book.id,
    //   book.stock - newOrderItem.quantity,
    // );

    await this.booksService.update(book.id, {
      id: book.id,
      stock: book.stock - newOrderItem.quantity,
    });

    // Save the order item
    const savedOrderItem = await this.orderItemsRepository.save(newOrderItem);

    // console.log('here', savedOrderItem);
    const orderToUpdate = await savedOrderItem.order;
    // update the order total amount
    await this.updateOrderTotal(orderToUpdate.id);
    return savedOrderItem;
  }

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemsRepository.find();
  }

  async findOne(id: string): Promise<OrderItem> {
    const orderItem = await this.orderItemsRepository.findOne({
      where: { id },
    });

    if (!orderItem) {
      throw new NotFoundException(`Order item #${id} not found`);
    }

    return orderItem;
  }

  async update(
    id: string,
    updateOrderItemInput: UpdateOrderItemInput,
  ): Promise<OrderItem> {
    const orderItem = await this.findOne(id);
    const book = await this.booksService.findOne(orderItem.book.id);

    if (!!updateOrderItemInput.quantity) {
      // Calculate stock difference
      const stockDifference =
        updateOrderItemInput.quantity - orderItem.quantity;

      // Check stock availability for increase
      if (stockDifference > 0 && book.stock < stockDifference) {
        throw new BadRequestException('Insufficient stock');
      }

      // Update book stock
      await this.booksService.update(book.id, {
        id: book.id,
        stock: book.stock - stockDifference,
      });
    }

    // Update order item
    const updated = await this.orderItemsRepository.preload({
      id,
      ...updateOrderItemInput,
    });

    if (!updated) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    const savedOrderItem = await this.orderItemsRepository.save(updated);

    const orderToUpdate = await savedOrderItem.order;
    // Update order total
    await this.updateOrderTotal(orderToUpdate.id);

    return savedOrderItem;
  }

  async remove(id: string): Promise<OrderItem> {
    const orderItem = await this.findOne(id);

    // Restore book stock
    await this.booksService.update(orderItem.book.id, {
      id: orderItem.book.id,
      stock: orderItem.book.stock + orderItem.quantity,
    });

    await this.orderItemsRepository.remove(orderItem);

    // Update order total
    await this.updateOrderTotal(orderItem.order.id);

    return orderItem;
  }

  private async updateOrderTotal(orderId: string): Promise<void> {
    const orderItems = await this.orderItemsRepository.find({
      where: { order: { id: orderId } },
    });

    const total = orderItems.reduce(
      (sum, item) => sum + item.quantity * Number(item.unit_price),
      0,
    );

    await this.ordersService.update(orderId, {
      id: orderId,
      total_amount: total,
    });
  }

  async findByOrder(orderId: string): Promise<OrderItem[]> {
    return this.orderItemsRepository.find({
      where: { order: { id: orderId } },
      relations: ['book'],
    });
  }
}
