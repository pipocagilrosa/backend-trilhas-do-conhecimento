import { Course } from '../entity/course.entity';

export class CreateCourseResponseDto {
  title: string;
  description: string;
  id: string;
  index: number;
  language: string;
  typeContent?: string;
  url: string;
  price: number;
  hasCertificate: boolean;
  isEnrollNeeded: boolean;
  givenRatingAuthor: number;
  addedBy: {
    name: string;
  };
  categories: { id: string; topic: string; level: string }[];
  createdAt: Date;
  updatedAt: Date;
  inactive: boolean;

  static convertCreateCourseDomainToResponse(course: Course): CreateCourseResponseDto {
    return {
      title: course.title,
      description: course.description,
      id: course.id,
      index: course.index,
      language: course.language,
      typeContent: course.typeContent || '',
      url: course.url,
      price: course.price,
      hasCertificate: course.hasCertificate,
      isEnrollNeeded: course.isEnrollNeeded,
      givenRatingAuthor: course.givenRatingAuthor,
      addedBy: {
        name: course.addedBy.name
      },
      categories: course.categories.map(category => ({
        id: category.id,
        topic: category.topic,
        level: category.level,
      })), // Mapeia as categorias associadas ao curso
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      inactive: course.inactive,
    };
  }
}
