import format from 'date-fns-tz/format';
import { Role } from '../../enums/role.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { CareerTrack } from 'src/courses/entity/career-track.entity';
import { Course } from 'src/courses/entity/course.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  birthDate: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  rawCreatedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: false })
  inactive: boolean;

  @Column({ nullable: true, default: null })
  disabledAt?: Date;

  @Column({ nullable: true, unique: true, default: null })
  resetPasswordToken?: string;

  @Column({ nullable: false })
  favoriteWordPhrase: string;

  @ManyToMany(() => CareerTrack, careerTrack => careerTrack.users)
  @JoinTable()
  careerTracks: CareerTrack[];

  @OneToMany(() => Course, course => course.addedBy)
  courses: Course[];

  // Getter to return createdAt in Brasília timezone
  get createdAt(): string {
    const brasiliaTimezone = 'America/Sao_Paulo';
    return format(this.rawCreatedAt, 'dd-MM-yyyy HH:mm:ss', { timeZone: brasiliaTimezone });
  }
}
