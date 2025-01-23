import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    const newUser = this.userRepository.create({
      ...signupInput,
      password: bcrypt.hashSync(signupInput.password, 10),
    });
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.deleted = :deleted', { deleted: false });

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, deleted: false },
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        ...updateUserInput,
        id,
      });

      if (!user) {
        throw new NotFoundException(`User #${id} not found`);
      }

      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async totalUsers(): Promise<number> {
    return this.userRepository.count({
      where: {
        deleted: false,
      },
    });
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.deleted = true;
    await this.userRepository.save(user);
    return user;
  }

  private handleDBErrors(error: any) {
    this.logger.error(error);
    if (error.code === '23505') {
      throw new BadRequestException('User already exists');
    }

    if (error.code === 'error--001') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException(
      'Something went wrong, please check the logs',
    );
  }
}
