import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, Like } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
  ) {}

  async create(dto: CreateCustomerDto) {
    const validateFullName = await this.repo.findOne({
      where: { fullName: dto.fullName },
    });
    if (validateFullName)
      throw new NotFoundException(`El nombre ${dto.fullName} ya está en uso.`);

    const entity = this.repo.create(dto);
    return await this.repo.save(entity);
  }

  async findAll(params: QueryCustomerDto) {
    const where: FindOptionsWhere<Customer>[] = [];

    const take = Math.min(params.take ?? 20, 100);
    const skip = params.skip ?? 0;

    if (params.q) {
      const likePattern = Like(`%${params.q}%`);
      where.push({ fullName: likePattern });
      where.push({ phone: likePattern });
    }

    const baseWhere: FindOptionsWhere<Customer> = {};
    if (params.status) baseWhere.status = params.status;

    const order: Record<string, 'ASC' | 'DESC'> = {};
    if (params.order) {
      const [field, dir] = params.order.split(':');
      order[field] = dir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    } else {
      order['createdAt'] = 'DESC';
    }

    const [items, total] = await this.repo.findAndCount({
      where: where.length
        ? where.map((w) => ({ ...w, ...baseWhere }))
        : baseWhere,
      order,
      take,
      skip,
    });

    return { items, total };
  }

  async findOne(id: string) {
    const found = await this.repo.findOne({ where: { id: Number(id) } });
    if (!found) throw new NotFoundException('Customer not found');
    return found;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const found = await this.findOne(id);
    const merged = this.repo.merge(found, dto);
    return await this.repo.save(merged);
  }

  async remove(id: string) {
    const found = await this.findOne(id);
    await this.repo.remove(found);
    return { id };
  }
}
