import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';

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

  @ManyToMany(() => Tournament, (tournament) => tournament.participants)
  tournaments: Tournament[];
}
