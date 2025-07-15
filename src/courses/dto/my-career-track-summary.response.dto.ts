import { CareerTrack } from '../entity/career-track.entity';

export class MyCareerTrackSummaryResponse {
    id: string;
    title: string;
    area: string;
    description: string;
    subTitle: string;
    image: string;
    index: number;
    totalTopics: number;
    totalCourses: number;
    completedCourses?: number; // Para futuras implementações de progresso

    static fromCareerTrack(careerTrack: CareerTrack): MyCareerTrackSummaryResponse {
        if (!careerTrack) {
            throw new Error('CareerTrack data is null or undefined');
        }

        let totalCourses = 0;
        const levels = new Set<string>();

        if (careerTrack.categoryCourse && Array.isArray(careerTrack.categoryCourse)) {
            careerTrack.categoryCourse
                .filter(category => category && !category.inactive)
                .forEach(category => {
                    if (category.level) {
                        levels.add(category.level);
                    }
                    if (category.courses && Array.isArray(category.courses)) {
                        totalCourses += category.courses.filter(course => course && !course.inactive).length;
                    }
                });
        }

        return {
            id: careerTrack.id || '',
            title: careerTrack.title || 'Título não disponível',
            area: careerTrack.area || 'Área não especificada',
            description: careerTrack.description || 'Descrição não disponível',
            subTitle: careerTrack.subTitle || '',
            image: careerTrack.image || '',
            index: careerTrack.index || 0,
            totalTopics: careerTrack.categoryCourse ?
                new Set(careerTrack.categoryCourse
                    .filter(category => category && !category.inactive && category.topic)
                    .map(category => category.topic)).size : 0,
            totalCourses,
            completedCourses: 0 // Para implementação futura
        };
    }
}
