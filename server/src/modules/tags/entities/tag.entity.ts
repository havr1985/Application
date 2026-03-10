import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Event } from '../../events/entities/event.entity';

@Entity('tags')
export class Tag extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @ManyToMany(() => Event, (event) => event.tags)
  events: Event[];
}
