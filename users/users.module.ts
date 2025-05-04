import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { CareerTrack } from 'src/courses/entity/career-track.entity';
import { Course } from 'src/courses/entity/course.entity';
import { UserCourse } from './entity/user-course.entity';
import { CourseRating } from 'src/courses/entity/course-rating.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User, Course, UserCourse, CareerTrack, CourseRating])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})

export class UsersModule { }
