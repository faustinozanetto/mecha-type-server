import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

export enum TestType {
  WORDS = 'WORDS',
  TIME = 'TIME',
}

export enum TestLanguage {
  ENGLISH = 'ENGLISH',
  SPANISH = 'SPANISH',
}

@Entity({ name: 'Test Presets' })
export class TestPresetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TestType, default: TestType.WORDS })
  type: TestType;

  @Column({ type: 'enum', enum: TestLanguage, default: TestLanguage.ENGLISH })
  language: TestLanguage;

  @Column({ type: 'int' })
  time: number;

  @Column({ type: 'int' })
  words: number;

  @ManyToOne(() => UserEntity, (user) => user.testPresets)
  user: UserEntity;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
