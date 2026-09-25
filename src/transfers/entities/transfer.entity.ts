import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LocalEntity } from '../../locals/locals.entity';
import { EmployeeEntity } from '../../employees/entities/employee.entity';

@Entity({ name: 'tb_transfers', schema: 'public' })
export class TransferEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'date', nullable: true })
  fecha_deposito: string;

  @Column({ type: 'bigint' })
  local_id: number;

  @Column({ type: 'bigint' })
  employee_id: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto: number;

  @Column({ type: 'text', nullable: true })
  comentario: string;

  @Column({ type: 'varchar' }) // Salario / Adelanto / Quincena / Bono / Previsión / Dia Extra / Hora Extra
  tipo_pago: string;

  @Column({ type: 'varchar', default: 'Pendiente' }) // Pendiente / Aprobada
  estado: string;

  // Snapshot de datos bancarios para registro inmutable
  @Column({ type: 'varchar', nullable: true })
  datos_bancarios_rut: string;

  @Column({ type: 'varchar', nullable: true })
  datos_bancarios_banco: string;

  @Column({ type: 'varchar', nullable: true })
  datos_bancarios_cuenta: string;

  @Column({ type: 'varchar', nullable: true })
  datos_bancarios_tipo_cuenta: string;

  @ManyToOne(() => LocalEntity)
  @JoinColumn({ name: 'local_id' })
  local: LocalEntity;

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @CreateDateColumn({ name: 'create_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_at: Date;
}
