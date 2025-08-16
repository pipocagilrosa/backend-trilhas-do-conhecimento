import { Controller, Post, Body, UseGuards, Request, Get, Patch, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../enums/role.enum';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCourseResponseDto } from 'src/courses/dto/create-course-response.dto';
import { Course } from './entity/course.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  /**
 * Cria um curso
 *
 * @param createCourseDto dados do curso a ser criado
 * @param req requisi o, com o userId do usu rio que fez a requisi o
 *
 * @returns o curso criado
 */

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createCourseDto: CreateCourseDto, @Request() req) {
    const course = await this.coursesService.create(createCourseDto, req.user.id);
    return CreateCourseResponseDto.convertCreateCourseDomainToResponse(course);
  }

  // Endpoint para listar todos os cursos
  @Get()
  /**
   * Endpoint para listar todos os cursos
   * @returns {Promise<Course[]>} retorna todos os cursos cadastrados no sistema
   */
  /******  a2d6248b-f1c9-4957-829c-aebd45f51f26  *******/
  async findAllCourses() {
    return this.coursesService.findAllCourses();
  }

  @Patch('/:id/disable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async disableCourse(@Param('id') courseId: string): Promise<{ message: string }> {
    await this.coursesService.disableCourse(courseId);
    return { message: 'Course disabled successfully' };
  }

  @Get('career/:careerTrackId/topic/:topicName')
  async findCoursesByCareerAndTopic(
    @Param('careerTrackId') careerTrackId: string,
    @Param('topicName') topicName: string
  ): Promise<Course[]> {
    return this.coursesService.findCoursesByCareerAndTopic(careerTrackId, topicName);
  }

  @Get('career/:careerTrackId/grouped-by-topic')
  async findCoursesGroupedByTopicInCareer(
    @Param('careerTrackId') careerTrackId: string
  ): Promise<{ [topic: string]: Course[] }> {
    return this.coursesService.findCoursesGroupedByTopicInCareer(careerTrackId);
  }

}