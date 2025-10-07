
import { CareerTrack } from '../entity/career-track.entity';
import { CategoryCourse } from '../entity/category-course.entity';
import { Course } from '../entity/course.entity';
import { UserCourse } from 'src/users/entity/user-course.entity';
import { getRepository } from 'typeorm';

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

    static async fromCourseWithUser(course: Course, userId: string): Promise<EnrolledCourseResponseDto & { isFavorite: boolean, isCompleted: boolean }> {
        if (!course) {
            throw new Error('Course data is null or undefined');
        }
        const userCourseRepo = getRepository(UserCourse);
        const userCourse = await userCourseRepo.findOne({ where: { user: { id: userId }, course: { id: course.id } } });
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

    static async fromCareerTrackWithCategories(careerTrack: CareerTrack, userId: string): Promise<UserEnrolledCareerTrackResponse> {
        if (!careerTrack) {
            throw new Error('CareerTrack data is null or undefined');
        }

        // Organizar tópicos por nível
        const topicsMap = new Map<string, Map<string, Course[]>>();

        if (careerTrack.categoryCourse && Array.isArray(careerTrack.categoryCourse)) {
            careerTrack.categoryCourse
                .filter(category => category && !category.inactive)
                .forEach(category => {
                    const topicName = category.topic || 'Tópico não especificado';
                    const levelName = category.level || 'Nível não especificado';

                    if (!topicsMap.has(topicName)) {
                        topicsMap.set(topicName, new Map());
                    }

                    const topicMap = topicsMap.get(topicName)!;
                    if (!topicMap.has(levelName)) {
                        topicMap.set(levelName, []);
                    }

                    if (category.courses && Array.isArray(category.courses)) {
                        const activeCourses = category.courses
                            .filter(course => course && !course.inactive)
                            .sort((a, b) => (a.index || 0) - (b.index || 0));

                        topicMap.get(levelName)!.push(...activeCourses);
                    }
                });
        }

        // Converter para o formato de resposta
        const topics: EnrolledTopicResponseDto[] = [];

        for (const [topic, levelsMap] of topicsMap.entries()) {
            for (const [level, courses] of levelsMap.entries()) {
                if (courses.length > 0) {
                    const coursesWithStatus = await Promise.all(
                        courses.map(course => EnrolledCourseResponseDto.fromCourseWithUser(course, userId))
                    );
                    topics.push({
                        topic,
                        level,
                        courses: coursesWithStatus
                    });
                }
            }
        }

        // Ordenar tópicos e níveis
        topics.sort((a, b) => {
            // Primeiro por tópico
            const topicComparison = a.topic.localeCompare(b.topic);
            if (topicComparison !== 0) return topicComparison;

            // Depois por nível
            const levelOrder = { 'Iniciante': 1, 'Intermediário': 2, 'Avançado': 3 };
            return (levelOrder[a.level] || 4) - (levelOrder[b.level] || 4);
        });

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
