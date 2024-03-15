import { User } from 'src/APIs/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PostBlock {
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  user_id: User;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  content: string;

  @Column()
  index: number;
}
