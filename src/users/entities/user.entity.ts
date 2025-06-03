import { Column, Entity, OneToMany } from 'typeorm';
import { Song } from '../../songs/songs.entity';
import { UserType } from '../../utils/enums';
import { Exclude } from 'class-transformer';
import { AbstractedEntity } from 'src/Common/entities/entity';

@Entity({ name: 'users' })
export class User extends AbstractedEntity {
  @Column({ type: 'varchar', length: '150', nullable: true })
  username: string;

  @Column({ type: 'varchar', length: '250', unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.NORMAL_USER })
  userType: UserType;

  @Column({ default: false })
  isAccountVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  verificationToken: string | null;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  profileImage: string | null;

  @Column({ type: 'varchar', nullable: true, default: 'jwt' })
  kind: string | null;

  @OneToMany(() => Song, (song) => song.user)
  songs: Song[];

  // @OneToMany(() => Review, (review) => review.user)
  // reviews: Review[];
}
