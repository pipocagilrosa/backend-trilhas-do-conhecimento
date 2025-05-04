import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CourseRating } from "./course-rating.entity";
import { Max, Min } from "class-validator";
import { User } from "src/users/entity/users.entity";
import { CategoryCourse } from "./category-course.entity";

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  price: number;

  @Column({ name: 'has_certificate', nullable: false })
  hasCertificate: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: false })
  isEnrollNeeded: boolean;

  @Column({ default: false })
  inactive: boolean;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  @Min(0)
  @Max(5)
  givenRatingAuthor: number;

  @OneToMany(() => CourseRating, courseRating => courseRating.course)
  ratings: CourseRating[];

  @ManyToOne(() => User, user => user.courses)
  @JoinColumn({ name: 'added_by' }) // Especifica o nome da coluna
  addedBy: User;

  @Column({ default: 0 })
  index: number;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  typeContent: string;

  @ManyToMany(() => CategoryCourse, category => category.courses, { cascade: true })
  @JoinTable() // Cria a tabela de junção para o relacionamento ManyToMany
  categories: CategoryCourse[];

}