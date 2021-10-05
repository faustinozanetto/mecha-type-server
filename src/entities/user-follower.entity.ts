import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class UserFollowerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  following_id: string;

  @Column({ type: 'varchar' })
  follower_id: string;

  @ManyToOne(() => UserEntity, (u: UserEntity) => u.followers)
  @JoinColumn({ name: 'follower_id' })
  followers: UserEntity;

  @ManyToOne(() => UserEntity, (u: UserEntity) => u.following)
  @JoinColumn({ name: 'following_id' })
  following: UserEntity;
}
