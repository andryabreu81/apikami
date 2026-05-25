import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LocalEntity } from './locals.entity';

@Injectable()
export class LocalsService {
  constructor(
      @InjectRepository(LocalEntity)
      private readonly localsRepository: Repository<LocalEntity>,
    ) {}

  async getLocals(): Promise<LocalEntity[]> {
    //console.log('here service');
    return await this.localsRepository.find({
      relations:['user','user.role']
    });
  }


    // Obtener un local por su ID
    async findLocal(localId: number): Promise<LocalEntity | null> {
  
      return await this.localsRepository.findOne({ 
        where: { id: localId },
        relations:['user','user.role'] 
      });
  
    }

  // agregar un local
  async addLocal(
    localData: {
      name: string, 
      address: string, 
      user_id: number
    }): Promise<LocalEntity> {

    const newLocal = this.localsRepository.create(localData);

    return await this.localsRepository.save(newLocal);
  }

  // actualizar un usuario especifico
  async updateLocal(
    localId: number,
    updateData: { name?: string; address?: string;  user_id?: number; }
  ): Promise<LocalEntity | null> {
    
    // 1. Ejecutamos la actualización directamente en la BD
    await this.localsRepository.update(localId, updateData);

    // 2. Retornamos el usuario ya actualizado (reutilizando tu método findUser)
    return this.findLocal(localId);
  }
}
