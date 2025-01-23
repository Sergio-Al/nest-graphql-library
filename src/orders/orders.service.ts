import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly usersService: UsersService,
  ) {}

  async create(createOrderInput: CreateOrderInput): Promise<Order> {
    const newOrder = this.ordersRepository.create(createOrderInput);
    newOrder.user = await this.usersService.findOne(createOrderInput.userId);
    return await this.ordersRepository.save(newOrder);
  }

  async findAll(): Promise<Order[]> {
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .where('order.deleted = :deleted', { deleted: false });

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id, deleted: false },
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderInput: UpdateOrderInput): Promise<Order> {
    await this.findOne(id);
    const order = await this.ordersRepository.preload({
      ...updateOrderInput,
      id,
    });

    return await this.ordersRepository.save(order);
  }

  async remove(id: string): Promise<Order> {
    const order = await this.findOne(id);
    order.deleted = true;
    return await this.ordersRepository.save(order);
  }
}
