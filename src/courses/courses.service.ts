import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Course } from './entity/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { CategoryCourse } from './entity/category-course.entity';
import { FindAllCoursesResponseDto } from './dto/find-all-course-response.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(CategoryCourse)
    private categoryCourseRepository: Repository<CategoryCourse>,
  ) { }

  // Método para listar todos os cursos
  async findAllCourses(): Promise<FindAllCoursesResponseDto> {
    const categories = await this.categoryCourseRepository.find({
      relations: ['courses'], // Inclui os cursos relacionados
    });

    return FindAllCoursesResponseDto.convertAllCoursesDomainToResponse(categories);
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    return await this.coursesRepository.manager.transaction(async transactionalEntityManager => {
      const { categoriesIds, ...courseData } = createCourseDto;

      // Substitui findByIds por findBy com o operador In
      const categories = await transactionalEntityManager.findBy(CategoryCourse, {
        id: In(categoriesIds),
      });

      if (categories.length !== categoriesIds.length) {
        throw new NotFoundException('One or more categories not found');
      }

      const course = transactionalEntityManager.create(Course, {
        ...courseData,
        categories,
      });

      return transactionalEntityManager.save(course);
    });
  }

  async findCoursesByCategoryId(categoryId: string): Promise<Course[]> {
    const category = await this.categoryCourseRepository.findOne({
      where: { id: categoryId, inactive: false },
      relations: ['courses'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category.courses;
  }

  async disableCourse(courseId: string): Promise<void> {
    const course = await this.coursesRepository.findOne({ where: { id: courseId } });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    course.inactive = true;
    await this.coursesRepository.save(course);
  }
}