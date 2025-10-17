import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entity/course.entity';
import { CareerTrack } from './entity/career-track.entity';
import { CreateCareerTrackDto } from './dto/career-track.dto';
import { CategoryCourse } from './entity/category-course.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from 'src/users/entity/users.entity';
import { UserCourse } from 'src/users/entity/user-course.entity';
import { EnrolledCourseResponseDto, EnrolledTopicResponseDto, UserEnrolledCareerTrackResponse } from './dto/user-enrolled-career-track.response.dto';

@Injectable()
export class CareerTrackService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CareerTrack)
    private readonly careerTrackRepository: Repository<CareerTrack>,
    @InjectRepository(CategoryCourse)
    private readonly categoryCourseRepository: Repository<CategoryCourse>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>, // Certifique-se de que este repositório está registrado
    @InjectRepository(UserCourse)
    private readonly userCourseRepository: Repository<UserCourse>,
  ) { }

  /**
   * Retorna trilhas do usuário com status dos cursos (isFavorite, isCompleted)
   */
  async getUserEnrolledCareerTracksWithStatus(userId: string): Promise<UserEnrolledCareerTrackResponse[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId, inactive: false },
      relations: ['careerTracks', 'careerTracks.categoryCourse', 'careerTracks.categoryCourse.courses'],
    });
    if (!user) throw new NotFoundException('User not found');
    const userCourses = await this.userCourseRepository.find({
      where: { user: { id: userId } },
      relations: ['course'],
    });
    // Map courseId to userCourse
    const userCourseMap = new Map<string, UserCourse>();
    userCourses.forEach(uc => {
      if (uc.course?.id) userCourseMap.set(uc.course.id, uc);
    });
    const responses: UserEnrolledCareerTrackResponse[] = [];
    for (const careerTrack of user.careerTracks.filter(ct => !ct.inactive)) {
      // Organizar tópicos por nível
      const topicsMap = new Map<string, Map<string, Course[]>>();
      if (careerTrack.categoryCourse && Array.isArray(careerTrack.categoryCourse)) {
        careerTrack.categoryCourse
          .filter(category => category && !category.inactive)
          .forEach(category => {
            const topicName = category.topic || 'Tópico não especificado';
            const levelName = category.level || 'Nível não especificado';
            if (!topicsMap.has(topicName)) topicsMap.set(topicName, new Map());
            const topicMap = topicsMap.get(topicName)!;
            if (!topicMap.has(levelName)) topicMap.set(levelName, []);
            if (category.courses && Array.isArray(category.courses)) {
              const activeCourses = category.courses
                .filter(course => course && !course.inactive)
                .sort((a, b) => (a.index || 0) - (b.index || 0));
              topicMap.get(levelName)!.push(...activeCourses);
            }
          });
      }
      // Converter para o formato de resposta
      const topics: EnrolledTopicResponseDto[] = [];
      for (const [topic, levelsMap] of topicsMap.entries()) {
        for (const [level, courses] of levelsMap.entries()) {
          if (courses.length > 0) {
            const coursesWithStatus = courses.map(course => {
              const userCourse = userCourseMap.get(course.id);
              return EnrolledCourseResponseDto.fromCourseWithUser(course, userCourse);
            });
            topics.push({ topic, level, courses: coursesWithStatus });
          }
        }
      }
      // Ordenar tópicos e níveis
      topics.sort((a, b) => {
        const topicComparison = a.topic.localeCompare(b.topic);
        if (topicComparison !== 0) return topicComparison;
        const levelOrder = { 'Iniciante': 1, 'Intermediário': 2, 'Avançado': 3 };
        return (levelOrder[a.level] || 4) - (levelOrder[b.level] || 4);
      });
      responses.push(UserEnrolledCareerTrackResponse.fromCareerTrackWithCategories(careerTrack, topics));
    }
    return responses;
  }

  /**
   * Retorna uma trilha específica do usuário com status dos cursos (isFavorite, isCompleted)
   */
  async getUserEnrolledCareerTrackByIdWithStatus(userId: string, careerTrackId: string): Promise<UserEnrolledCareerTrackResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId, inactive: false },
      relations: ['careerTracks', 'careerTracks.categoryCourse', 'careerTracks.categoryCourse.courses'],
    });
    if (!user) throw new NotFoundException('User not found');

    // Buscar a carreira específica
    const careerTrack = user.careerTracks.find(track => track.id === careerTrackId && !track.inactive);
    if (!careerTrack) {
      throw new NotFoundException('Career track not found or user is not enrolled');
    }

    const userCourses = await this.userCourseRepository.find({
      where: { user: { id: userId } },
      relations: ['course'],
    });

    // Map courseId to userCourse
    const userCourseMap = new Map<string, UserCourse>();
    userCourses.forEach(uc => {
      if (uc.course?.id) userCourseMap.set(uc.course.id, uc);
    });

    // Organizar tópicos por nível
    const topicsMap = new Map<string, Map<string, Course[]>>();
    if (careerTrack.categoryCourse && Array.isArray(careerTrack.categoryCourse)) {
      careerTrack.categoryCourse
        .filter(category => category && !category.inactive)
        .forEach(category => {
          const topicName = category.topic || 'Tópico não especificado';
          const levelName = category.level || 'Nível não especificado';
          if (!topicsMap.has(topicName)) topicsMap.set(topicName, new Map());
          const topicMap = topicsMap.get(topicName)!;
          if (!topicMap.has(levelName)) topicMap.set(levelName, []);
          if (category.courses && Array.isArray(category.courses)) {
            const activeCourses = category.courses
              .filter(course => course && !course.inactive)
              .sort((a, b) => (a.index || 0) - (b.index || 0));
            topicMap.get(levelName)!.push(...activeCourses);
          }
        });
    }

    // Converter para o formato de resposta
    const topics: EnrolledTopicResponseDto[] = [];
    for (const [topic, levelsMap] of topicsMap.entries()) {
      for (const [level, courses] of levelsMap.entries()) {
        if (courses.length > 0) {
          const coursesWithStatus = courses.map(course => {
            const userCourse = userCourseMap.get(course.id);
            return EnrolledCourseResponseDto.fromCourseWithUser(course, userCourse);
          });
          topics.push({ topic, level, courses: coursesWithStatus });
        }
      }
    }

    // Ordenar tópicos e níveis
    topics.sort((a, b) => {
      const topicComparison = a.topic.localeCompare(b.topic);
      if (topicComparison !== 0) return topicComparison;
      const levelOrder = { 'Iniciante': 1, 'Intermediário': 2, 'Avançado': 3 };
      return (levelOrder[a.level] || 4) - (levelOrder[b.level] || 4);
    });

    return UserEnrolledCareerTrackResponse.fromCareerTrackWithCategories(careerTrack, topics);
  }

  async create(createCareerTrackDto: CreateCareerTrackDto): Promise<CareerTrack> {
    const careerTrack = this.careerTrackRepository.create(createCareerTrackDto);
    return this.careerTrackRepository.save(careerTrack);
  }

  async findAll(): Promise<CareerTrack[]> {
    return this.careerTrackRepository.find({ where: { inactive: false } });
  }

  //inactive: false
  //{ where: { email, inactive: false } }

  async findCoursesByCareerTrackId(careerTrackId: string): Promise<{ career: CareerTrack; courses: Course[] }> {
    const careerTrack = await this.careerTrackRepository.findOne({
      where: { id: careerTrackId, inactive: false },
      relations: ['categoryCourse'], // Relacionamento com categorias
    });

    if (!careerTrack) {
      throw new NotFoundException('CareerTrack not found');
    }

    // Busca os cursos associados às categorias da CareerTrack
    const categories = await this.categoryCourseRepository.find({
      where: { careerTrack, inactive: false },
      relations: ['courses'], // Relacionamento com cursos
    });

    const courses = categories.flatMap(category => category.courses);

    return { career: careerTrack, courses };
  }

  async findOne(id: string): Promise<CareerTrack> {
    const careerTrack = await this.careerTrackRepository.findOne({ where: { id } });
    if (!careerTrack) {
      throw new NotFoundException('CareerTrack not found');
    }
    return careerTrack;
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryCourse> {
    const { careerTrackId, topic, level } = createCategoryDto;

    // Verifica se a CareerTrack existe
    const careerTrack = await this.careerTrackRepository.findOne({ where: { id: careerTrackId, inactive: false } });
    if (!careerTrack) {
      throw new NotFoundException('CareerTrack not found');
    }

    // Cria a categoria associada à CareerTrack
    const category = this.categoryCourseRepository.create({
      careerTrack,
      topic,
      level,
    });

    return this.categoryCourseRepository.save(category);
  }

  async findCategoriesByCareerTrackId(careerTrackId: string): Promise<CareerTrack> {
    const careerTrack = await this.careerTrackRepository.findOne({
      where: { id: careerTrackId, inactive: false },
      relations: ['categoryCourse'], // Certifique-se de carregar o relacionamento
    });

    if (!careerTrack) {
      throw new NotFoundException('CareerTrack not found');
    }

    return careerTrack;
  }

  async disableCareer(careerTrackId: string): Promise<void> {
    const careerTrack = await this.careerTrackRepository.findOne({ where: { id: careerTrackId, inactive: false } });

    if (!careerTrack) {
      throw new NotFoundException('CareerTrack not found');
    }

    careerTrack.inactive = true;
    await this.careerTrackRepository.save(careerTrack);
  }

  async disableCategory(categoryId: string): Promise<void> {
    const category = await this.categoryCourseRepository.findOne({ where: { id: categoryId } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.inactive = true;
    await this.categoryCourseRepository.save(category);
  }

  async enrollUserInCareerTrack(userId: string, careerTrackIds: string[]): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId, inactive: false }, // Agora o TypeORM reconhece 'id'
      relations: ['careerTracks'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const careerTracks = await this.careerTrackRepository.findByIds(careerTrackIds);

    if (careerTracks.length !== careerTrackIds.length) {
      throw new NotFoundException('One or more career tracks not found');
    }

    // Evita duplicação de trilhas de carreira
    const newCareerTracks = careerTracks.filter(
      (track) => !user.careerTracks.some((userTrack) => userTrack.id === track.id),
    );

    user.careerTracks = [...user.careerTracks, ...newCareerTracks];
    await this.userRepository.save(user);
  }

  async findAllWithSubscription(userId: string | null): Promise<CareerTrack[]> {
    const careerTracks = await this.careerTrackRepository.find({ where: { inactive: false } });

    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId, inactive: false },
        relations: ['careerTracks'],
      });

      if (user) {
        careerTracks.forEach(track => {
          track['subscribed'] = user.careerTracks.some(userTrack => userTrack.id === track.id);
        });
      }
    }

    return careerTracks.map(track => ({
      ...track,
      subscribed: track['subscribed'] || false, // Garante que "subscribed" seja false para usuários não logados
    }));
  }

  async findCategoriesWithSubscription(careerTrackId: string, userId: string | null): Promise<CareerTrack> {
    const careerTrack = await this.careerTrackRepository.findOne({
      where: { id: careerTrackId, inactive: false },
      relations: ['categoryCourse'],
    });

    if (!careerTrack) {
      throw new NotFoundException('CareerTrack not found');
    }

    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId, inactive: false },
        relations: ['careerTracks'],
      });

      if (user) {
        careerTrack['subscribed'] = user.careerTracks.some(userTrack => userTrack.id === careerTrackId);
      }
    }

    return careerTrack;
  }

  async findUserEnrolledCareerTracks(userId: string): Promise<CareerTrack[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId, inactive: false },
      relations: ['careerTracks', 'careerTracks.categoryCourse', 'careerTracks.categoryCourse.courses'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Filtrar apenas carreiras ativas
    return user.careerTracks
      .filter(careerTrack => !careerTrack.inactive)
      .sort((a, b) => a.index - b.index);
  }

  async findUserEnrolledCareerTrackById(userId: string, careerTrackId: string): Promise<CareerTrack> {
    const user = await this.userRepository.findOne({
      where: { id: userId, inactive: false },
      relations: ['careerTracks', 'careerTracks.categoryCourse', 'careerTracks.categoryCourse.courses'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const careerTrack = user.careerTracks.find(track => track.id === careerTrackId && !track.inactive);

    if (!careerTrack) {
      throw new NotFoundException('Career track not found or user is not enrolled');
    }

    return careerTrack;
  }

  async findAllCategories(): Promise<CategoryCourse[]> {
    return this.categoryCourseRepository.find({
      where: { inactive: false },
      relations: ['careerTrack'],
      order: { careerTrack: { index: 'ASC' }, topic: 'ASC', level: 'ASC' }
    });
  }

  async findOrCreateCategoryByTopicAndCareer(
    careerTrackId: string,
    topicName: string,
    level: string
  ): Promise<CategoryCourse> {
    // Verifica se a carreira existe
    const careerTrack = await this.careerTrackRepository.findOne({
      where: { id: careerTrackId, inactive: false }
    });

    if (!careerTrack) {
      throw new NotFoundException('Career track not found');
    }

    // Busca se já existe uma categoria com esse tópico e nível nesta carreira
    let category = await this.categoryCourseRepository.findOne({
      where: {
        careerTrack: { id: careerTrackId },
        topic: topicName,
        level: level,
        inactive: false
      },
      relations: ['careerTrack']
    });

    // Se não existe, cria uma nova
    if (!category) {
      category = this.categoryCourseRepository.create({
        careerTrack,
        topic: topicName,
        level: level,
        inactive: false
      });
      category = await this.categoryCourseRepository.save(category);
    }

    return category;
  }

  async findCategoriesByCareerAndTopic(careerTrackId: string, topicName: string): Promise<CategoryCourse[]> {
    return this.categoryCourseRepository.find({
      where: {
        careerTrack: { id: careerTrackId },
        topic: topicName,
        inactive: false
      },
      relations: ['careerTrack', 'courses'],
      order: { level: 'ASC' }
    });
  }

}