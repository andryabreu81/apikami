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
      console.log('here service');
      return await this.localsRepository.find({
        relations:['user']
      });
    }
}
