import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Access } from '../entities/access.entity';

import { Role } from '../entities/role.entity';
import { UserContextService } from 'src/userContext/service/userContext.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    public roleRepository: Repository<Role>,
    @InjectRepository(Access)
    public accessRepository: Repository<Access>,
  ) {}

  async create(data: CreateRoleDto) {
    const newObj = this.roleRepository.create(data);

    if (data.id_access) {
      const access = await this.accessRepository.findBy({
        id_access: In(data.id_access),
      });
      newObj.access = access;
    }

    const savedRole = await this.roleRepository.save(newObj);

    return savedRole;
  }

  async findAll() {
    const list = await this.roleRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findAllWithAccess() {
    const list = await this.roleRepository.find({
      where: { status: 1 },
      relations: ['access'],
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const obj = await this.roleRepository.findOne({
      relations: ['access'],
      where: { id_role: id, status: 1 },
    });
    if (!obj) {
      throw new NotFoundException(`This role #${id} not found`);
    }
    return obj;
  }

  async update(id: number, changes: UpdateRoleDto) {
    const item = await this.roleRepository.findOneBy({
      id_role: id,
      status: 1,
    });
    this.roleRepository.merge(item, changes);

    if (changes.id_access) {
      const access = await this.accessRepository.findBy({
        id_access: In(changes.id_access),
      });
      item.access = access;
    }
    const savedRole = await this.roleRepository.save(item);

    return savedRole;
  }

  async remove(id: number) {
    const item = await this.roleRepository.findOneBy({ id_role: id });
    const deleteRole: UpdateRoleDto = {
      status: 0,
    };

    this.roleRepository.merge(item, deleteRole);

    const savedRole = await this.roleRepository.save(item);

    return savedRole;
  }
}
