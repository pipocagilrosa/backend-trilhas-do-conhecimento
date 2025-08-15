import { Course } from '../entity/course.entity';

export class CoursesByTopicResponseDto {
    topic: string;
    careerTrack: string;
    totalCourses: number;
    courses: CourseSimpleDto[];

    constructor(topic: string, careerTrack: string, courses: Course[]) {
        this.topic = topic;
        this.careerTrack = careerTrack;
        this.totalCourses = courses.length;
        this.courses = courses.map(course => CourseSimpleDto.fromCourse(course));
    }
}

export class CourseSimpleDto {
    id: string;
    title: string;
    description: string;
    level: string;
    url: string;
    price: number;
    language: string;
    typeContent: string;
    givenRatingAuthor: number;

    constructor(
        id: string,
        title: string,
        description: string,
        level: string,
        url: string,
        price: number,
        language: string,
        typeContent: string,
        givenRatingAuthor: number
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.level = level;
        this.url = url;
        this.price = price;
        this.language = language;
        this.typeContent = typeContent;
        this.givenRatingAuthor = givenRatingAuthor;
    }

    static fromCourse(course: Course): CourseSimpleDto {
        return new CourseSimpleDto(
            course.id,
            course.title,
            course.description,
            course.categories?.[0]?.level || 'N/A',
            course.url,
            course.price,
            course.language || 'N/A',
            course.typeContent || 'N/A',
            course.givenRatingAuthor
        );
    }
}
