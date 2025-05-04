import { IsNotEmpty, IsString, IsNumber, IsBoolean, Min, Max, IsOptional, IsArray, IsUUID } from 'class-validator';
import { Course } from '../entity/course.entity';

export class CreateCourseDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Level is required' })
  @IsString({ message: 'Level must be a string' })
  level: string;

  @IsNotEmpty({ message: 'URL is required' })
  @IsString({ message: 'URL must be a string' })
  url: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  @IsNotEmpty({ message: 'Has Certificate is required' })
  @IsBoolean({ message: 'Has Certificate must be a boolean' })
  hasCertificate: boolean;

  @IsNotEmpty({ message: 'Is Enroll Needed is required' })
  @IsBoolean({ message: 'Is Enroll Needed must be a boolean' })
  isEnrollNeeded: boolean;

  @IsNotEmpty({ message: 'The rating giving by the author is required' })
  @IsNumber({}, { message: 'The rating giving by the author must be a number between 0 and 5' })
  @Min(0)
  @Max(5)
  givenRatingAuthor: number;

  @IsNotEmpty({ message: 'Topic is required' })
  @IsString({ message: 'Topic must be a string' })
  topic: string;

  @IsOptional()
  @IsNumber({}, { message: 'Index must be a number' })
  index?: number;

  @IsNotEmpty({ message: 'Language is required' })
  @IsString({ message: 'Language must be a string' })
  language: string;

  @IsOptional()
  @IsString({ message: 'TypeContent must be a string' })
  typeContent?: string;

  @IsArray({ message: 'Categories must be an array of IDs' })
  @IsUUID('4', { each: true, message: 'Each category ID must be a valid UUID' })
  categoriesIds: string[];

  static convertDtoToEntity(createCourseDto: CreateCourseDto): Course {
    const course = new Course();
    course.title = createCourseDto.title;
    course.description = createCourseDto.description;
    course.url = createCourseDto.url;
    course.price = createCourseDto.price;
    course.hasCertificate = createCourseDto.hasCertificate;
    course.isEnrollNeeded = createCourseDto.isEnrollNeeded;
    course.givenRatingAuthor = createCourseDto.givenRatingAuthor;
    course.index = createCourseDto.index || 0;
    course.typeContent = createCourseDto.typeContent || '';
    course.language = createCourseDto.language;
    return course;
  }
}

