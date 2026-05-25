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


  // eliminar un local especifico
  async deleteLocal(localId: number): Promise<boolean> {
    if (!localId) {
      throw new Error('El ID del local es requerido para eliminar.');
    }

    // Ejecuta el DELETE. Retorna un objeto con información sobre las filas afectadas
    const result = await this.localsRepository.delete(localId);

    // Si 'affected' es mayor a 0, significa que el local existía y fue borrado
    return (result.affected ?? 0) > 0;
  }
}
