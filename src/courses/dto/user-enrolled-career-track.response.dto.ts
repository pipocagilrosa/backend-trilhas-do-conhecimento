
import { CareerTrack } from '../entity/career-track.entity';
import { CategoryCourse } from '../entity/category-course.entity';
import { Course } from '../entity/course.entity';


export class EnrolledCourseResponseDto {
    id: string;
    title: string;
    description: string;
    url: string;
    price: number;
    hasCertificate: boolean;
    isEnrollNeeded: boolean;
    givenRatingAuthor: number;
    language: string;
    typeContent: string;
    index: number;

    static fromCourseWithUser(course: Course, userCourse?: { favorite?: boolean, completed?: boolean }): EnrolledCourseResponseDto & { isFavorite: boolean, isCompleted: boolean } {
        if (!course) {
            throw new Error('Course data is null or undefined');
        }
        return {
            id: course.id || '',
            title: course.title || 'Título não disponível',
            description: course.description || 'Descrição não disponível',
            url: course.url || '',
            price: course.price || 0,
            hasCertificate: course.hasCertificate || false,
            isEnrollNeeded: course.isEnrollNeeded || false,
            givenRatingAuthor: course.givenRatingAuthor || 0,
            language: course.language || 'Não especificado',
            typeContent: course.typeContent || 'Conteúdo',
            index: course.index || 0,
            isFavorite: userCourse?.favorite === true,
            isCompleted: userCourse?.completed === true
        };
    }
}

export class EnrolledTopicResponseDto {
    topic: string;
    level: string;
    courses: EnrolledCourseResponseDto[];
}

export class UserEnrolledCareerTrackResponse {
    id: string;
    title: string;
    area: string;
    description: string;
    subTitle: string;
    content: string;
    image: string;
    contentTitle: string;
    contentImage: string;
    contentSubtitle: string;
    index: number;
    topics: EnrolledTopicResponseDto[];

    static fromCareerTrackWithCategories(careerTrack: CareerTrack, topics: EnrolledTopicResponseDto[]): UserEnrolledCareerTrackResponse {
        if (!careerTrack) {
            throw new Error('CareerTrack data is null or undefined');
        }
        return {
            id: careerTrack.id || '',
            title: careerTrack.title || 'Título não disponível',
            area: careerTrack.area || 'Área não especificada',
            description: careerTrack.description || 'Descrição não disponível',
            subTitle: careerTrack.subTitle || '',
            content: careerTrack.content || '',
            image: careerTrack.image || '',
            contentTitle: careerTrack.contentTitle || '',
            contentImage: careerTrack.contentImage || '',
            contentSubtitle: careerTrack.contentSubtitle || '',
            index: careerTrack.index || 0,
            topics
        };
    }
}
