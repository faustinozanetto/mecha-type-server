import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'Accuracy' })
export class AccuracyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  amount: number;

  @ManyToOne(() => UserEntity, (user) => user.accuracy)
  user: UserEntity;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
