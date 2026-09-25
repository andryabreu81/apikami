import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { EmployeeLocalEntity } from './employee-local.entity';

@Entity({ name: 'tb_employees', schema: 'public' })
export class EmployeeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  apellido: string;

  @Column({ type: 'date' })
  fecha_nacimiento: string;

  @Column({ type: 'varchar' }) // Mujer / Hombre
  sexo: string;

  @Column({ type: 'varchar' }) // Residente Legal / No regulado
  estatus_migratorio: string;

  @Column({ type: 'varchar' })
  telefono: string;

  @Column({ type: 'varchar' })
  dni: string;

  @Column({ type: 'varchar' }) // Carnet / Pasaporte
  tipo_dni: string;

  @Column({ type: 'varchar' }) // Si / No / Pendiente de Informe
  antecedentes: string;

  @Column({ type: 'varchar', nullable: true })
  certificado_antecedentes_url: string;

  @Column({ type: 'varchar' })
  nacionalidad: string;

  @Column({ type: 'varchar', default: 'Activo' }) // Activo / Inactivo
  estado: string;

  @Column({ type: 'varchar' }) 
  cargo: string;

  // Datos bancarios
  @Column({ type: 'varchar', nullable: true })
  datos_bancarios_rut: string;

  @Column({ type: 'varchar', nullable: true })
  datos_bancarios_banco: string;

  @Column({ type: 'varchar', nullable: true })
  datos_bancarios_cuenta: string;

  @Column({ type: 'varchar', nullable: true })
  datos_bancarios_tipo_cuenta: string;

  @OneToMany(() => EmployeeLocalEntity, (employeeLocal) => employeeLocal.employee, { cascade: true })
  sucursales: EmployeeLocalEntity[];

  @CreateDateColumn({ name: 'create_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_at: Date;
}
