import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalsService } from './locals.service';
import { LocalsController } from './locals.controller';
import { LocalEntity } from './locals.entity';

@Module({
  controllers: [LocalsController],
  providers: [LocalsService],
  imports: [
    TypeOrmModule.forFeature([LocalEntity]), 
  ],
})
export class LocalsModule {}
