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
import { EnrolledCourseResponseDto, EnrolledTopicResponseDto } from './dto/user-enrolled-career-track.response.dto';
import { UserCourse } from '../users/entity/user-course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(CategoryCourse)
    private categoryCourseRepository: Repository<CategoryCourse>,
    @InjectRepository(UserCourse)
    private userCourseRepository: Repository<UserCourse>,
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
   * Filtra cursos baseado em múltiplos critérios e retorna agrupados por tópico
   * Retorna no mesmo formato da API my-enrollments
   * @param filters - Objeto com os filtros a serem aplicados
   * @param userId - ID do usuário para buscar status de favoritos e conclusão
   * @returns Array de tópicos com cursos agrupados por nível
   */
  async filterCoursesGroupedByTopic(filters: FilterCoursesDto, userId: string): Promise<EnrolledTopicResponseDto[]> {
    // Busca as categorias da trilha específica
    const categoriesQuery = this.categoryCourseRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.courses', 'course')
      .leftJoinAndSelect('category.careerTrack', 'careerTrack')
      .where('category.inactive = :inactive', { inactive: false })
      .andWhere('course.inactive = :courseInactive', { courseInactive: false });

    // Filtro obrigatório por trilha
    if (!filters.careerTrackId) {
      throw new NotFoundException('careerTrackId is required for filtering courses');
    }
    categoriesQuery.andWhere('careerTrack.id = :careerTrackId', { careerTrackId: filters.careerTrackId });

    // Filtro por palavras-chave (busca em título, descrição e tipo)
    const keywords = [filters.keyword1, filters.keyword2, filters.keyword3].filter(k => k);
    if (keywords.length > 0) {
      categoriesQuery.andWhere(
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
      categoriesQuery.andWhere('LOWER(category.level) = LOWER(:level)', { level: filters.level });
    }

    // Filtro por tópico/assunto
    if (filters.topic) {
      categoriesQuery.andWhere('LOWER(category.topic) LIKE LOWER(:topic)', { topic: `%${filters.topic}%` });
    }

    // Filtro por idioma
    if (filters.language) {
      categoriesQuery.andWhere('LOWER(course.language) = LOWER(:language)', { language: filters.language });
    }

    // Filtro por tipo de conteúdo
    if (filters.typeContent) {
      categoriesQuery.andWhere('LOWER(course.typeContent) = LOWER(:typeContent)', { typeContent: filters.typeContent });
    }

    const categories = await categoriesQuery
      .orderBy('category.topic', 'ASC')
      .addOrderBy('category.level', 'ASC')
      .addOrderBy('course.index', 'ASC')
      .getMany();

    // Busca os dados de UserCourse para o usuário
    const userCourses = await this.userCourseRepository.find({
      where: { user: { id: userId } },
      relations: ['course'],
    });

    // Map courseId to userCourse
    const userCourseMap = new Map<string, UserCourse>();
    userCourses.forEach(uc => {
      if (uc.course?.id) userCourseMap.set(uc.course.id, uc);
    });

    // Organiza os cursos por tópico e nível
    const topicsMap = new Map<string, Map<string, Course[]>>();

    categories.forEach(category => {
      const topicName = category.topic || 'Tópico não especificado';
      const levelName = category.level || 'Nível não especificado';

      if (!topicsMap.has(topicName)) {
        topicsMap.set(topicName, new Map());
      }

      const topicMap = topicsMap.get(topicName)!;
      if (!topicMap.has(levelName)) {
        topicMap.set(levelName, []);
      }

      if (category.courses && Array.isArray(category.courses)) {
        const activeCourses = category.courses
          .filter(course => course && !course.inactive)
          .sort((a, b) => (a.index || 0) - (b.index || 0));

        topicMap.get(levelName)!.push(...activeCourses);
      }
    });

    // Converte para o formato de resposta
    const topics: EnrolledTopicResponseDto[] = [];

    for (const [topic, levelsMap] of topicsMap.entries()) {
      for (const [level, courses] of levelsMap.entries()) {
        // Remove duplicatas por ID
        const uniqueCourses = courses.filter((course, index, self) =>
          index === self.findIndex(c => c.id === course.id)
        );

        if (uniqueCourses.length > 0) {
          const coursesWithStatus = uniqueCourses.map(course => {
            const userCourse = userCourseMap.get(course.id);
            return EnrolledCourseResponseDto.fromCourseWithUser(course, userCourse);
          });

          topics.push({
            topic,
            level,
            courses: coursesWithStatus
          });
        }
      }
    }

    // Ordena tópicos e níveis
    topics.sort((a, b) => {
      const topicComparison = a.topic.localeCompare(b.topic);
      if (topicComparison !== 0) return topicComparison;
      const levelOrder = { 'Iniciante': 1, 'Intermediário': 2, 'Avançado': 3 };
      return (levelOrder[a.level] || 4) - (levelOrder[b.level] || 4);
    });

    return topics;
  }
}