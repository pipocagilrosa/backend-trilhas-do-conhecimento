import { User } from 'src/users/entity/users.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { CategoryCourse } from './category-course.entity';

@Entity()
export class CareerTrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  area: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  subTitle: string;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false })
  contentTitle: string;

  @Column({ nullable: true })
  contentImage: string;

  @Column({ nullable: false })
  contentSubtitle: string;

  @Column({ nullable: false })
  index: number;

  @ManyToMany(() => User, user => user.careerTracks)
  users: User[];

  @OneToMany(() => CategoryCourse, categoryCourse => categoryCourse.careerTrack)
  categoryCourse: CategoryCourse[];

  @Column({ default: false })
  inactive: boolean;
}