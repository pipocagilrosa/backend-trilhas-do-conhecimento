import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/users.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateUserDto } from './dto/update-user.dto';
// import { CareerTrack } from 'src/courses/entity/career-track.entity';
import { UserCourse } from './entity/user-course.entity';
import { Course } from 'src/courses/entity/course.entity';

import { CareerTrack } from 'src/courses/entity/career-track.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailService: MailerService,
    @InjectRepository(UserCourse)
    private userCourseRepository: Repository<UserCourse>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(CareerTrack)
    private careerTrackRepository: Repository<CareerTrack>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User();
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = hashPassword;
      user.birthDate = createUserDto.birthDate;
      user.favoriteWordPhrase = createUserDto.favoriteWordPhrase;
      user.role = 'user';
      return this.userRepository.save(user);
    } catch (err) {
      throw new Error(`Error creating ${err} user ${err.message}`);
    }
  }

  async findOne(email: string, password: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      const isMatch = await bcrypt.compare(password, user.password);
      if (user && isMatch) {

        return user;
      } else {
        throw new Error(`User not found`);
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  async findUserDetails(id: string | null, email: string | null): Promise<User | undefined> {
    try {
      let user: User | undefined;

      if (id !== null) {
        user = await this.userRepository.findOne({ where: { id, inactive: false } });
      } else if (email !== null) {
        user = await this.userRepository.findOne({ where: { email, inactive: false } });
      }

      if (user) {
        return user;
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (err) {
      throw new NotFoundException(`Error finding user: ${err.message}`);
    }
  }

  async disableUser(id: string) {
    try {
      const user = await this.findUserDetails(id, null);
      user.inactive = true;
      user.disabledAt = new Date();
      await this.userRepository.save(user);
      return user;
    } catch (err) {
      throw new Error(`Error disabling user: ${err.message}`);
    }
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const token = uuidv4();
    user.resetPasswordToken = token;
    await this.userRepository.save(user);

    const message = `Esqueceu sua senha? Token para recuperar senha: ${token} - se você não resetou sua senha ignore esse email!`;

    this.mailService.sendMail({
      from: 'contato@apenascoisas.com.br',
      to: user.email,
      subject: `Esqueceu senha`,
      text: message,
    });

  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id, inactive: false } });
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    await this.sendUserUpdateEmail(user.email);
  }

  async sendUserUpdateEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const message = `
    Olá, ${user.name}!\n
    Tudo certo por aqui!\n
    Estamos passando para informar que a alteração dos seus dados cadastrais foi concluída com sucesso.
    Agora, suas informações estão devidamente atualizadas em nosso sistema, garantindo que você continue aproveitando todos os nossos serviços e benefícios sem nenhum problema.

    `;

    this.mailService.sendMail({
      from: 'contato@apenascoisas.com.br',
      to: user.email,
      subject: `Dados de cadastro atualizados`,
      text: message,
    });

  }

  async resetPassword(token: string | null, confirmFavoriteWordPhrase: string | null, newPassword: string) {
    let user: User | undefined;
    if (token != null) {
      user = await this.userRepository.findOne({ where: { resetPasswordToken: token } });
    } else if (confirmFavoriteWordPhrase != null) {
      user = await this.userRepository.findOne({ where: { favoriteWordPhrase: confirmFavoriteWordPhrase } });
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    await this.userRepository.save(user);
  }

  async confirmPassPhrase(token: string | null, confirmFavoriteWordPhrase: string | null) {
    let user: User | undefined;
    if (token != null) {
      user = await this.userRepository.findOne({ where: { resetPasswordToken: token } });
    } else if (confirmFavoriteWordPhrase != null) {
      user = await this.userRepository.findOne({ where: { favoriteWordPhrase: confirmFavoriteWordPhrase } });
    }

    if (user) {
      return user;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async passwordResetSecure(email: string, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Password invalid');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.resetPasswordToken = null;
    await this.userRepository.save(user);
  }

  async getCareerTracks(): Promise<CareerTrack[]> {
    return this.careerTrackRepository.find();
  }

  async enrollCareerTracks(userId: string, careerTrackIds: string[]): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId, inactive: false }, relations: ['careerTracks'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const careerTracks = await this.careerTrackRepository.findByIds(careerTrackIds);
    user.careerTracks = [...user.careerTracks, ...careerTracks];
    await this.userRepository.save(user);
  }

  async getActiveCareerTracks(userId: string): Promise<{ id: string; area: string; description: string; image: string; userName: string; status: string }[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId, inactive: false },
      relations: ['careerTracks', 'careerTracks.categoryCourse', 'careerTracks.categoryCourse.courses'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Para cada trilha, calcular status em inglês
    const result = [];
    for (const careerTrack of user.careerTracks) {
      // Todos os cursos da trilha
      const allCourses = (careerTrack.categoryCourse || []).flatMap(cat => cat.courses || []);
      const courseIds = allCourses.map(c => c.id);
      // Cursos concluídos pelo usuário
      const completedUserCourses = await this.userCourseRepository.find({
        where: { user: { id: userId }, completed: true },
        relations: ['course'],
      });
      const completedIds = completedUserCourses.map(uc => uc.course.id);
      const completedCount = courseIds.filter(id => completedIds.includes(id)).length;
      let status = 'not_started';
      if (completedCount === 0) status = 'not_started';
      else if (completedCount === courseIds.length && courseIds.length > 0) status = 'completed';
      else if (completedCount > 0) status = 'in_progress';
      result.push({
        id: careerTrack.id,
        area: careerTrack.area,
        description: careerTrack.description,
        image: careerTrack.image,
        userName: user.name,
        status
      });
    }
    return result;
  }

  async enrollCourse(userId: string, courseId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId, inactive: false } });
    const course = await this.coursesRepository.findOne({ where: { id: courseId, inactive: false } });

    if (!user || !course) {
      throw new NotFoundException('User or Course not found');
    }

    const userCourse = new UserCourse();
    userCourse.user = user;
    userCourse.course = course;
    await this.userCourseRepository.save(userCourse);
  }

  async getActiveCourses(userId: string): Promise<Course[]> {
    const userCourses = await this.userCourseRepository.find({
      where: { user: { id: userId }, completed: false },
      relations: ['course'],
    });

    return userCourses.map(userCourse => userCourse.course);
  }

  // --- NOVOS MÉTODOS ---

  async setCourseCompleted(userId: string, courseId: string, completed: boolean): Promise<void> {
    let userCourse = await this.userCourseRepository.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
      relations: ['user', 'course'],
    });
    if (!userCourse) {
      // Cria se não existir
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const course = await this.coursesRepository.findOne({ where: { id: courseId } });
      if (!user || !course) throw new NotFoundException('User or Course not found');
      userCourse = this.userCourseRepository.create({ user, course });
    }
    userCourse.completed = completed;
    userCourse.completedAt = completed ? new Date() : null;
    await this.userCourseRepository.save(userCourse);
  }

  async setCourseFavorite(userId: string, courseId: string, favorite: boolean): Promise<void> {
    let userCourse = await this.userCourseRepository.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
      relations: ['user', 'course'],
    });
    if (!userCourse) {
      // Cria se não existir
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const course = await this.coursesRepository.findOne({ where: { id: courseId } });
      if (!user || !course) throw new NotFoundException('User or Course not found');
      userCourse = this.userCourseRepository.create({ user, course });
    }
    userCourse.favorite = favorite;
    await this.userCourseRepository.save(userCourse);
  }

  async getFavoriteCourses(userId: string): Promise<any[]> {
    const userCourses = await this.userCourseRepository.find({
      where: { user: { id: userId }, favorite: true },
      relations: ['course'],
    });
    return userCourses.map(uc => ({
      ...uc.course,
      isFavorite: true,
      isCompleted: uc.completed === true
    }));
  }

  /**
   * Retorna o status de cada trilha do usuário:
   * - Não Iniciado: nenhum curso concluído
   * - Em Andamento: pelo menos um, mas não todos concluídos
   * - Concluído: todos concluídos
   */
  async getCareerTrackStatus(userId: string): Promise<{ careerTrackId: string, status: string }[]> {
    // Busca todas as trilhas do usuário
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['careerTracks', 'careerTracks.categoryCourse', 'careerTracks.categoryCourse.courses'],
    });
    if (!user) throw new NotFoundException('User not found');

    const result: { careerTrackId: string, status: string }[] = [];
    for (const track of user.careerTracks) {
      // Todos os cursos da trilha
      const allCourses = (track.categoryCourse || []).flatMap(cat => cat.courses || []);
      const courseIds = allCourses.map(c => c.id);
      if (courseIds.length === 0) {
        result.push({ careerTrackId: track.id, status: 'Não Iniciado' });
        continue;
      }
      // Cursos concluídos pelo usuário
      const completedUserCourses = await this.userCourseRepository.find({
        where: { user: { id: userId }, completed: true },
        relations: ['course'],
      });
      const completedIds = completedUserCourses.map(uc => uc.course.id);
      const completedCount = courseIds.filter(id => completedIds.includes(id)).length;
      let status = 'Não Iniciado';
      if (completedCount === 0) status = 'Não Iniciado';
      else if (completedCount === courseIds.length) status = 'Concluído';
      else status = 'Em Andamento';
      result.push({ careerTrackId: track.id, status });
    }
    return result;
  }

}
