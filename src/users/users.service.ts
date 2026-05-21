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

  // Obtener un usuario por su ID
  async findUser(userId: number): Promise<UserEntity | null> {

    return await this.usersRepository.findOne({ 
      where: { id: userId },
      relations:['role'] 
    });

  }

  // agregar un usuario
  async addUsers(
    name: string, 
    email: string, 
    lastname: string, 
    role_id: number, 
    password:string): Promise<UserEntity> {

    const newUser = this.usersRepository.create({ name, email, lastname, role_id,  password });

    return await this.usersRepository.save(newUser);
  }

}
