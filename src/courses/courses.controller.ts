import { Controller, Post, Body, UseGuards, Request, Get, Patch, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../enums/role.enum';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCourseResponseDto } from 'src/courses/dto/create-course-response.dto';
import { Course } from './entity/course.entity';
import { FilterCoursesDto } from './dto/filter-courses.dto';
import { FilteredCoursesResponseDto } from './dto/filtered-courses-response.dto';

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

  /**
   * Endpoint para filtrar cursos por múltiplos critérios
   * @param filterDto - Query params com filtros (keyword1, keyword2, keyword3, level, topic, careerTrackId, language, typeContent)
   * @returns {Promise<FilteredCoursesResponseDto>} cursos filtrados com metadata
   * 
   * Exemplos de uso:
   * - /courses/filter?keyword1=javascript&level=Iniciante
   * - /courses/filter?topic=Backend&language=Português
   * - /courses/filter?keyword1=python&keyword2=data&keyword3=science&careerTrackId=123
   */
  @Get('filter')
  @UseGuards(JwtAuthGuard)
  async filterCourses(@Query() filterDto: FilterCoursesDto): Promise<FilteredCoursesResponseDto> {
    const courses = await this.coursesService.filterCourses(filterDto);
    return FilteredCoursesResponseDto.create(courses, filterDto);
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