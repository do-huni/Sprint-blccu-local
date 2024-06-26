import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/APIs/users/entities/user.entity';
import { NotType } from 'src/commons/enums/not-type.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Notification {
  @ApiProperty({ description: 'PK: A_I_', type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '알림을 생성한 유저 정보', type: User })
  @JoinColumn()
  @ManyToOne(() => User)
  user: User;

  @ApiProperty({ description: '알림을 생성한 유저 FK', type: Number })
  @Column()
  @RelationId((notification: Notification) => notification.user)
  userKakaoId: number;

  @ApiProperty({ description: '알림을 받는 유저 정보', type: User })
  @JoinColumn()
  @ManyToOne(() => User)
  targetUser: User;

  @ApiProperty({ description: '알림을 받는 유저 FK', type: Number })
  @Column()
  @RelationId((notification: Notification) => notification.targetUser)
  targetUserKakaoId: number;

  @ApiProperty({ description: '알림의 유형', type: 'enum', enum: NotType })
  @Column()
  type: NotType;

  @ApiProperty({ description: '알림 체크 여부', type: Boolean })
  @Column()
  is_checked: boolean;

  @ApiProperty({ description: '리다이렉션 url', type: String })
  @Column()
  url: string;

  @ApiProperty({ description: '알림 메시지' })
  @Column()
  message: string;

  @CreateDateColumn()
  date_created: Date;

  @DeleteDateColumn()
  date_deleted: Date;
}
