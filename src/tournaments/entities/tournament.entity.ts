import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToMany(() => User, (user) => user.tournaments)
  @JoinTable()
  participants: User[];
}
