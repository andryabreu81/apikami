import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';

import { RoleEntity } from '../rols/rols.entity';
import { LocalEntity } from '../locals/locals.entity';

@Entity({ name: 'tb_users', schema: 'public' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  lastname: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true, select: false }) 
  password?: string;

  @Column({ name: 'rol_id', type: 'int', insert: false, update: false }) 
  role_id: number;

  @Column({ type: 'int', default: 1, nullable: true })
  active: number;

  // CORRECCIÓN: El tipo debe ser RoleEntity, no number
  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'rol_id' }) 
  role: RoleEntity;



  @CreateDateColumn({ name: 'create_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @UpdateDateColumn({ name: 'modified_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modified_at: Date;
}