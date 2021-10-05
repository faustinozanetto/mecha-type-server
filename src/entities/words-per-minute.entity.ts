import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'Words Per Minute' })
export class WordsPerMinuteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  amount: number;

  @ManyToOne(() => UserEntity, (user) => user.wordsPerMinute)
  user: UserEntity;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
