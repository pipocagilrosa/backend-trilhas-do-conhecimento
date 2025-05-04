import { CategoryCourse } from '../entity/category-course.entity';

export class FindAllCoursesResponseDto {
  categories: {
    id: string;
    topic: string;
    level: string;
    courses: {
      id: string;
      title: string;
      description: string;
      url: string;
      price: number;
      hasCertificate: boolean;
      isEnrollNeeded: boolean;
      givenRatingAuthor: number;
      index: number;
      language: string;
      typeContent?: string;
    }[];
  }[];

  static convertAllCoursesDomainToResponse(categories: CategoryCourse[]): FindAllCoursesResponseDto {
    const formattedCategories = categories.map(category => ({
      id: category.id,
      topic: category.topic,
      level: category.level,
      courses: category.courses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        url: course.url,
        price: course.price,
        hasCertificate: course.hasCertificate,
        isEnrollNeeded: course.isEnrollNeeded,
        givenRatingAuthor: course.givenRatingAuthor,
        index: course.index,
        language: course.language,
        typeContent: course.typeContent,
      })),
    }));

    return { categories: formattedCategories };
  }
}