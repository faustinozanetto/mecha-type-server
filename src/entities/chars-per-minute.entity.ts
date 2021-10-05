import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'Chars Per Minute' })
export class CharsPerMinuteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  amount: number;

  @ManyToOne(() => UserEntity, (user) => user.charsPerMinute)
  user: UserEntity;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
