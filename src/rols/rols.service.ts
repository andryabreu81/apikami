import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//entity
import { RoleEntity } from './rols.entity'

@Injectable()
export class RolsService {
  constructor(
      @InjectRepository(RoleEntity)
      private readonly usersRepository: Repository<RoleEntity>,
    ) {}
  
    async getRoles(): Promise<RoleEntity[]> {
      console.log('here service');
      return await this.usersRepository.find({
        relations:['users']
      });
    }
}
