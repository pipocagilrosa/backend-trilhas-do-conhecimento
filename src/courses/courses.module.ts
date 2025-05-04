import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CareerTrack } from './entity/career-track.entity';
import { Course } from './entity/course.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { User } from 'src/users/entity/users.entity';
import { CourseRating } from './entity/course-rating.entity';
import { CareerTrackController } from './career-track.controller';
import { CareerTrackService } from './career-track.service';
import { CategoryCourse } from './entity/category-course.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User, CareerTrack, Course, CategoryCourse, CourseRating])],
  controllers: [CoursesController, CareerTrackController],
  providers: [CoursesService, CareerTrackService],
  exports: [CoursesService, CareerTrackService],
})
export class CoursesModule { }