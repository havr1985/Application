import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Tag } from '../../tags/entities/tag.entity';

export enum VisibilityEvent {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

@Entity('events')
export class Event extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'date_time', type: 'timestamptz' })
  dateTime: Date;

  @Column({ type: 'varchar', length: 200 })
  location: string;

  @Column({ type: 'int', nullable: true })
  capacity: number | null;

  @Column({
    type: 'enum',
    enum: VisibilityEvent,
    enumName: 'visibility_event_enum',
    default: VisibilityEvent.PUBLIC,
  })
  visibility: VisibilityEvent;

  @ManyToOne(() => User, (user) => user.organizerEvents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizer_id' })
  organizer: User;

  @ManyToMany(() => User, (user) => user.participantEvents)
  @JoinTable({
    name: 'event_participants',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  participants: User[];

  @ManyToMany(() => Tag, (tag) => tag.events)
  @JoinTable({
    name: 'event_tags',
    joinColumn: { name: 'event_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: Tag[];
}
