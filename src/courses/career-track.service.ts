import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entity/course.entity';
import { CareerTrack } from './entity/career-track.entity';
import { CreateCareerTrackDto } from './dto/career-track.dto';
import { CategoryCourse } from './entity/category-course.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from 'src/users/entity/users.entity';

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
  ) { }

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

    return careerTracks;
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

}