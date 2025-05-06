import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Param,
  Delete,
  Req,
  ForbiddenException,
  BadRequestException,
  Put,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { convertDomainToResponse } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CareerTrack } from 'src/courses/entity/career-track.entity';
import { Course } from 'src/courses/entity/course.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/signup')
  @ApiOperation({
    summary: 'Sign Up as a user',
  })
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:userId/profile')
  async getProfile(@Req() request: Request, @Param('userId') userId: string) {

    if ((<any>request).user.userId !== userId) {
      throw new ForbiddenException('You cannot access user\'s account with this token');
    }

    const userDetails = await this.usersService.findUserDetails(userId, null);

    return convertDomainToResponse(userDetails);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:userId/profile-update')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateUserProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Param('userId') userId: string
  ): Promise<{ message: string }> {

    await this.usersService.updateUser(userId, updateUserDto);
    return { message: 'User details updated successfully' };
  }


  @Post('/reset-password')
  @HttpCode(200)
  async resetPassword(@Body('email') email: string) {
    await this.usersService.sendPasswordResetEmail(email);
  }

  @Post('/confirm-reset-password')
  @HttpCode(200)
  async confirmPasswordReset(@Body() body: { token: string | null, favoriteWordPhrase: string | null, newPassword: string }) {
    const { token, favoriteWordPhrase, newPassword } = body;
    await this.usersService.resetPassword(token, favoriteWordPhrase, newPassword);
  }

  @Post('/confirm-pass')
  @HttpCode(200)
  async confirmPassPhrase(@Body() body: { token: string | null, favoriteWordPhrase: string | null }) {
    const { token, favoriteWordPhrase } = body;
    await this.usersService.confirmPassPhrase(token, favoriteWordPhrase);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/reset-password-secure')
  @HttpCode(200)
  async passwordReset(@Body() body: { email: string, oldPassword: string, newPassword: string }) {
    const { email, oldPassword, newPassword } = body;
    await this.usersService.passwordResetSecure(email, oldPassword, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:userId/disable')
  async disableUser(@Req() request: Request, @Param('userId') userId: string) {

    if ((<any>request).user.userId !== userId) {
      throw new ForbiddenException('You cannot access user\'s account with this token');
    }

    const disableUser = await this.usersService.disableUser(userId);

  }

  @Post('/:userId/enroll-career-tracks')
  @UseGuards(JwtAuthGuard)

  async enrollCareerTracks(
    @Param('userId') userId: string,
    @Body('careerTrackIds') careerTrackIds: string[]
  ): Promise<{ message: string }> {
    await this.usersService.enrollCareerTracks(userId, careerTrackIds);
    return { message: 'Successfully enrolled in the selected career tracks' };
  }

  @Get('/:userId/active-career-tracks')
  @UseGuards(JwtAuthGuard)
  async getActiveCareerTracks(
    @Param('userId') userId: string,
  ): Promise<{ area: string; description: string; image: string; userName: string }[]> {
    return this.usersService.getActiveCareerTracks(userId);
  }

  @Post('/:userId/enroll-course')
  @UseGuards(JwtAuthGuard)
  async enrollCourse(
    @Param('userId') userId: string,
    @Body('courseId') courseId: string
  ): Promise<{ message: string }> {
    await this.usersService.enrollCourse(userId, courseId);
    return { message: 'Successfully enrolled in the course' };
  }

  @Get('/:userId/active-courses')
  @UseGuards(JwtAuthGuard)
  async getActiveCourses(@Param('userId') userId: string): Promise<Course[]> {
    return this.usersService.getActiveCourses(userId);
  }
  /*
  @Put('/:userToken/request-enable')
  async requestEnable(@Param('userToken') userToken: string) {
    
    await this.usersService.enableUser(userToken); 
    return { message: 'User enabled.' };

  }
  */
}
