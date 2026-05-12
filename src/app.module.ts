import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolsModule } from './rols/rols.module';

// entities
import { UserEntity } from './users/users.entity'
import { RoleEntity } from './rols/rols.entity';

@Module({
  imports: [UsersModule,TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '20111981',
      database: 'db_apikami',
      entities: [UserEntity, RoleEntity], // O [__dirname + '/**/*.entity{.ts,.js}']
      synchronize: false, // Mantenlo en false si la tabla ya existe
    }), UsersModule, RolsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
