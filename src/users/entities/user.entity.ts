import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.id)
  role: Role;
}
