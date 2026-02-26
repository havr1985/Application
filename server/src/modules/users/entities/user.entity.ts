import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Event } from '../../events/entities/event.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => Event, (event) => event.organizer)
  organizerEvents: Event[];

  @ManyToMany(() => Event, (event) => event.participants)
  participantEvents: Event[];
}
