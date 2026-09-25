import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EmployeeEntity } from './employee.entity';
import { LocalEntity } from '../../locals/locals.entity';

@Entity({ name: 'tb_employee_locals', schema: 'public' })
export class EmployeeLocalEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  employee_id: number;

  @Column({ type: 'bigint' })
  local_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salario: number;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.sucursales, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @ManyToOne(() => LocalEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'local_id' })
  local: LocalEntity;
}
