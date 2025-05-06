import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/users.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateUserDto } from './dto/update-user.dto';
import { CareerTrack } from 'src/courses/entity/career-track.entity';
import { UserCourse } from './entity/user-course.entity';
import { Course } from 'src/courses/entity/course.entity';


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

  async getActiveCareerTracks(userId: string): Promise<{ area: string; description: string; image: string; userName: string }[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId, inactive: false },
      relations: ['careerTracks'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Mapeia os dados necessários
    return user.careerTracks.map(careerTrack => ({
      area: careerTrack.area,
      description: careerTrack.description,
      image: careerTrack.image,
      userName: user.name, // Nome do usuário
    }));
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

}
