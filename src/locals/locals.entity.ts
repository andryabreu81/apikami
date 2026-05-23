import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn,
  Index
} from 'typeorm';
import { UserEntity } from '../users/users.entity'; // Ajusta la ruta de tu entidad de usuario

@Entity({ name: 'tb_locals', schema: 'public' })
// Mapeamos el índice compuesto que tienes en el DDL
@Index('tb_locals_id_idx', ['id', 'user_id']) 
export class LocalEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string; // bigserial se maneja como string para evitar pérdida de precisión

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  // Guardamos la columna física para escenarios donde solo quieras usar el ID directamente
  @Column({ type: 'bigint', nullable: true })
  user_id: string;

  @Column({ type: 'int', default: 1, nullable: true })
  active: number;

  // RELACIÓN: Muchos locales pertenecen a un usuario
  @ManyToOne(() => UserEntity, (user) => user.locals, { nullable: true })
  @JoinColumn({ name: 'user_id' }) // Conecta con la FK física del DDL
  user: UserEntity;

  @CreateDateColumn({ name: 'create_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_at: Date;
}