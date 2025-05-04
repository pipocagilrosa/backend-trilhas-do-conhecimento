import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Course } from "./course.entity";
import { User } from 'src/users/entity/users.entity';
import { Max, Min } from "class-validator";


@Entity()
export class CourseRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Course, course => course.ratings)
  course: Course;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  @Min(0)
  @Max(5)
  rating: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: false })
  inactive: boolean;

}