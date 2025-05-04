import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/users.entity';
import * as bcrypt from 'bcrypt';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User();
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = hashPassword;
      user.birthDate = createUserDto.birthDate;
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
        user = await this.userRepository.findOne({where: {id, inactive: false}});
      } else if (email !== null) {
        user = await this.userRepository.findOne({ where: {email } });
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
        await this.userRepository.save(user);
        return user;
    } catch (err) {
        throw new Error(`Error disabling user: ${err.message}`);
    }
}
}
