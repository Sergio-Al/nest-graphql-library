import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    const newCategory = this.categoriesRepository.create(createCategoryInput);
    return await this.categoriesRepository.save(newCategory);
  }

  async findAll(): Promise<Category[]> {
    const queryBuilder = this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.deleted = :deleted', { deleted: false });

    const categories = await queryBuilder.getMany();

    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    await this.findOne(id);
    const category = await this.categoriesRepository.preload({
      ...updateCategoryInput,
      id,
    });

    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    const updatedCategory = await this.categoriesRepository.save(category);
    return updatedCategory;
  }

  async findCategoriesByIds(ids: string[]): Promise<Category[]> {
    const categories = await this.categoriesRepository.find({
      where: {
        id: In([...ids]),
        deleted: false,
      },
    });

    return categories;
  }

  async remove(id: string): Promise<Category> {
    const category = await this.findOne(id);

    category.deleted = true;

    return await this.categoriesRepository.save(category);
  }

  async totalCategories(): Promise<number> {
    return this.categoriesRepository.count({
      where: {
        deleted: false,
      },
    });
  }
}
