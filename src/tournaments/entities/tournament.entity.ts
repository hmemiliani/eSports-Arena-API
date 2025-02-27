import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Match } from 'src/matches/entities/match.entity';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ default: 16 })
  maxParticipants: number;

  @ManyToMany(() => User, (user) => user.tournaments)
  @JoinTable()
  participants: User[];

  @OneToMany(() => Match, (match) => match.tournament, { cascade: true })
  matches: Match[];
  users: any;
}
