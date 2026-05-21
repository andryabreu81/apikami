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

  // actualizar un usuario especifico
  async updateUser(
    userId: number,
    updateData: { name?: string; lastname?: string; email?: string; role_id?: number; password?: string }
  ): Promise<UserEntity | null> {
    
    // 1. Ejecutamos la actualización directamente en la BD
    await this.usersRepository.update(userId, updateData);

    // 2. Retornamos el usuario ya actualizado (reutilizando tu método findUser)
    return this.findUser(userId);
  }

  // eliminar un usuario especifico
  async deleteUser(userId: number): Promise<boolean> {
    if (!userId) {
      throw new Error('El ID del usuario es requerido para eliminar.');
    }

    // Ejecuta el DELETE. Retorna un objeto con información sobre las filas afectadas
    const result = await this.usersRepository.delete(userId);

    // Si 'affected' es mayor a 0, significa que el usuario existía y fue borrado
    return (result.affected ?? 0) > 0;
  }

}
