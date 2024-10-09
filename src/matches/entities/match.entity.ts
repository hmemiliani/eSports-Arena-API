import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Tournament } from '../../tournaments/entities/tournament.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.matches, {
    onDelete: 'CASCADE',
  })
  tournament: Tournament;

  @ManyToOne(() => User, { eager: true })
  player1: User;

  @ManyToOne(() => User, { eager: true })
  player2: User;

  @Column({ nullable: true })
  winnerId: number | null;

  @Column({ type: 'int', default: 0 })
  player1Score: number;

  @Column({ type: 'int', default: 0 })
  player2Score: number;
}
