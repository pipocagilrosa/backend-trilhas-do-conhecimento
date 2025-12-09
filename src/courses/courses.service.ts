import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Like, Brackets } from 'typeorm';
import { Course } from './entity/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { CategoryCourse } from './entity/category-course.entity';
import { FindAllCoursesResponseDto } from './dto/find-all-course-response.dto';
import { CareerTrackService } from './career-track.service';
import { User } from '../users/entity/users.entity';
import { FilterCoursesDto } from './dto/filter-courses.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(CategoryCourse)
    private categoryCourseRepository: Repository<CategoryCourse>,
    private careerTrackService: CareerTrackService,
  ) { }

  // Método para listar todos os cursos
  async findAllCourses(): Promise<FindAllCoursesResponseDto> {
    const categories = await this.categoryCourseRepository.find({
      relations: ['courses'], // Inclui os cursos relacionados
    });

    return FindAllCoursesResponseDto.convertAllCoursesDomainToResponse(categories);
  }

  async create(createCourseDto: CreateCourseDto, addedByUserId?: string): Promise<Course> {
    return await this.coursesRepository.manager.transaction(async transactionalEntityManager => {
      const { careerTrackId, topicName, level, categoriesIds, ...courseData } = createCourseDto;

      let categories: CategoryCourse[] = [];

      // Nova funcionalidade: criar/encontrar tópico por nome
      if (careerTrackId && topicName) {
        const category = await this.careerTrackService.findOrCreateCategoryByTopicAndCareer(
          careerTrackId,
          topicName,
          level
        );
        categories = [category];
      }
      // Manter compatibilidade com o sistema antigo
      else if (categoriesIds && categoriesIds.length > 0) {
        categories = await transactionalEntityManager.findBy(CategoryCourse, {
          id: In(categoriesIds),
        });

        if (categories.length !== categoriesIds.length) {
          throw new NotFoundException('One or more categories not found');
        }
      } else {
        throw new NotFoundException('Either provide careerTrackId + topicName or categoriesIds');
      }

      const course = CreateCourseDto.convertDtoToEntity({ ...courseData, careerTrackId, topicName, level } as CreateCourseDto);
      course.categories = categories;

      // Se foi fornecido um userId, busca o usuário e associa
      if (addedByUserId) {
        const user = await transactionalEntityManager.findOne(User, {
          where: { id: addedByUserId }
        });
        if (user) {
          course.addedBy = user;
        }
      }

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

  async findCoursesByCareerAndTopic(careerTrackId: string, topicName: string): Promise<Course[]> {
    const categories = await this.careerTrackService.findCategoriesByCareerAndTopic(careerTrackId, topicName);

    if (!categories.length) {
      return [];
    }

    // Agrupa todos os cursos de todas as categorias deste tópico
    const allCourses = categories.flatMap(category => category.courses || []);

    // Remove duplicatas baseado no ID do curso
    const uniqueCourses = allCourses.filter((course, index, self) =>
      index === self.findIndex(c => c.id === course.id)
    );

    return uniqueCourses;
  }

  async findCoursesGroupedByTopicInCareer(careerTrackId: string): Promise<{ [topic: string]: Course[] }> {
    const categories = await this.categoryCourseRepository.find({
      where: {
        careerTrack: { id: careerTrackId },
        inactive: false
      },
      relations: ['courses'],
      order: { topic: 'ASC', level: 'ASC' }
    });

    const coursesByTopic: { [topic: string]: Course[] } = {};

    categories.forEach(category => {
      if (!coursesByTopic[category.topic]) {
        coursesByTopic[category.topic] = [];
      }

      // Adiciona cursos evitando duplicatas
      category.courses?.forEach(course => {
        if (!coursesByTopic[category.topic].find(c => c.id === course.id)) {
          coursesByTopic[category.topic].push(course);
        }
      });
    });

    return coursesByTopic;
  }

  /**
   * Filtra cursos baseado em múltiplos critérios
   * @param filters - Objeto com os filtros a serem aplicados
   * @returns Array de cursos que atendem aos critérios
   */
  async filterCourses(filters: FilterCoursesDto): Promise<Course[]> {
    const queryBuilder = this.coursesRepository.createQueryBuilder('course')
      .leftJoinAndSelect('course.categories', 'category')
      .leftJoinAndSelect('category.careerTrack', 'careerTrack')
      .where('course.inactive = :inactive', { inactive: false });

    // Filtro por palavras-chave (busca em título e descrição)
    const keywords = [filters.keyword1, filters.keyword2, filters.keyword3].filter(k => k);

    if (keywords.length > 0) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          keywords.forEach((keyword, index) => {
            const paramTitle = `keywordTitle${index}`;
            const paramDesc = `keywordDesc${index}`;
            const paramType = `keywordType${index}`;

            if (index === 0) {
              qb.where(
                `(LOWER(course.title) LIKE LOWER(:${paramTitle}) OR 
                  LOWER(course.description) LIKE LOWER(:${paramDesc}) OR 
                  LOWER(course.typeContent) LIKE LOWER(:${paramType}))`,
                {
                  [paramTitle]: `%${keyword}%`,
                  [paramDesc]: `%${keyword}%`,
                  [paramType]: `%${keyword}%`
                }
              );
            } else {
              qb.orWhere(
                `(LOWER(course.title) LIKE LOWER(:${paramTitle}) OR 
                  LOWER(course.description) LIKE LOWER(:${paramDesc}) OR 
                  LOWER(course.typeContent) LIKE LOWER(:${paramType}))`,
                {
                  [paramTitle]: `%${keyword}%`,
                  [paramDesc]: `%${keyword}%`,
                  [paramType]: `%${keyword}%`
                }
              );
            }
          });
        })
      );
    }

    // Filtro por nível
    if (filters.level) {
      queryBuilder.andWhere('LOWER(category.level) = LOWER(:level)', { level: filters.level });
    }

    // Filtro por tópico/assunto
    if (filters.topic) {
      queryBuilder.andWhere('LOWER(category.topic) LIKE LOWER(:topic)', { topic: `%${filters.topic}%` });
    }

    // Filtro por trilha de carreira
    if (filters.careerTrackId) {
      queryBuilder.andWhere('careerTrack.id = :careerTrackId', { careerTrackId: filters.careerTrackId });
    }

    // Filtro por idioma
    if (filters.language) {
      queryBuilder.andWhere('LOWER(course.language) = LOWER(:language)', { language: filters.language });
    }

    // Filtro por tipo de conteúdo
    if (filters.typeContent) {
      queryBuilder.andWhere('LOWER(course.typeContent) = LOWER(:typeContent)', { typeContent: filters.typeContent });
    }

    // Remove duplicatas e ordena
    const courses = await queryBuilder
      .orderBy('course.title', 'ASC')
      .getMany();

    // Remove cursos duplicados (caso um curso esteja em múltiplas categorias)
    const uniqueCourses = courses.filter((course, index, self) =>
      index === self.findIndex(c => c.id === course.id)
    );

    return uniqueCourses;
  }
}