import { AbstractedEntity } from 'src/Common/entities/entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'Songs' })
export class Song extends AbstractedEntity {
  @Column()
  name: string;

  @Column({ type: 'varchar' })
  artist: string;

  @Column({ type: 'date' })
  releasedDate: Date;

  @Column({ type: 'float' })
  duration: number;

  @Column({ type: 'text' })
  lyrics: string;

  @Column({ type: 'varchar' })
  audioUrl: String;

  @Column({ type: 'varchar' })
  imageUrl: String;

  @ManyToOne(() => User, (user) => user.songs, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
