import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//entity
import { UserEntity } from './users.entity'

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    console.log('here service');
    return await this.usersRepository.find({
      relations:['role']
    });
  }

}
