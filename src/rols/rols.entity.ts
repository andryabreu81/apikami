import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany 
} from 'typeorm';
import { UserEntity } from '../users/users.entity';

@Entity({ name: 'tb_roles', schema: 'public' })
export class RoleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string; // bigserial se mapea como string por precisión

  @Column({ type: 'varchar', nullable: true })
  role_code: string;

  @Column({ type: 'varchar', nullable: true })
  descripcion: string;

  @Column({ type: 'int', default: 1, nullable: true })
  active: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ name: 'modified_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modified_at: Date;

  // Relación con la tabla de usuarios
  @OneToMany(() => UserEntity, (user) => user.role_id)
  users: UserEntity[];
}