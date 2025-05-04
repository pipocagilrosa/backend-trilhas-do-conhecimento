import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CareerTrack } from "./career-track.entity";
import { Course } from "./course.entity";

@Entity()
export class CategoryCourse {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => CareerTrack, careerTrack => careerTrack.categoryCourse, { onDelete: 'CASCADE' })
    careerTrack: CareerTrack;

    @ManyToMany(() => Course, course => course.categories)
    courses: Course[];

    @Column({ nullable: false })
    topic: string;

    @Column({ nullable: false })
    level: string; // Iniciante, Intermediário, Avançado

    @Column({ default: false })
    inactive: boolean;
}