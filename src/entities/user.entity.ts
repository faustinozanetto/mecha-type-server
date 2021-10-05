import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WordsPerMinuteEntity } from './words-per-minute.entity';
import { CharsPerMinuteEntity } from './chars-per-minute.entity';
import { AccuracyEntity } from './accuracy.entity';
import { TestPresetEntity } from './test-preset.entity';
import { UserFollowerEntity } from './user-follower.entity';
export enum UserFilterBy {
  WPM = 'WPM',
  CPM = 'CPM',
  ACCURACY = 'ACCURACY',
  KEYSTROKES = 'KEYSTROKES',
  TESTSCOMPLETED = 'TESTSCOMPLETED',
}

export enum UserBadge {
  DEFAULT = 'DEFAULT',
  TESTER = 'TESTER',
  PRO = 'PRO',
}

export enum AuthProvider {
  DEFAULT = 'DEFAULT',
  DISCORD = 'DISCORD',
  GITHUB = 'GITHUB',
  GOOGLE = 'GOOGLE',
}

@Entity({ name: 'Users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  oauthId: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  avatar: string;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ type: 'int' })
  testsCompleted: number;

  @Column({ type: 'int' })
  wordsWritten: number;

  @Column({ type: 'int' })
  keystrokes: number;

  @Column({ type: 'enum', enum: UserBadge, default: UserBadge.DEFAULT })
  badge: UserBadge;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.DEFAULT })
  authProvider: AuthProvider;

  @ManyToMany(() => UserFollowerEntity, (user) => user.following)
  followers: UserFollowerEntity[];

  @ManyToMany(() => UserFollowerEntity, (user) => user.followers)
  following: UserFollowerEntity[];

  @OneToMany(() => WordsPerMinuteEntity, (wpm) => wpm.user)
  wordsPerMinute: WordsPerMinuteEntity[];

  @OneToMany(() => CharsPerMinuteEntity, (cpm) => cpm.user)
  charsPerMinute: CharsPerMinuteEntity[];

  @OneToMany(() => AccuracyEntity, (accuracy) => accuracy.user)
  accuracy: AccuracyEntity[];

  @OneToMany(() => TestPresetEntity, (testPreset) => testPreset.user)
  testPresets: TestPresetEntity[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
