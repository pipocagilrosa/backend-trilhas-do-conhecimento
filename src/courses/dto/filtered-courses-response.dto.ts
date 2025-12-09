import { Course } from '../entity/course.entity';

export class FilteredCoursesResponseDto {
    courses: Course[];
    total: number;
    appliedFilters: {
        keywords?: string[];
        level?: string;
        topic?: string;
        careerTrackId?: string;
        language?: string;
        typeContent?: string;
    };

    static create(courses: Course[], filters: any): FilteredCoursesResponseDto {
        const response = new FilteredCoursesResponseDto();
        response.courses = courses;
        response.total = courses.length;

        // Registra os filtros que foram aplicados
        const keywords = [];
        if (filters.keyword1) keywords.push(filters.keyword1);
        if (filters.keyword2) keywords.push(filters.keyword2);
        if (filters.keyword3) keywords.push(filters.keyword3);

        response.appliedFilters = {
            ...(keywords.length > 0 && { keywords }),
            ...(filters.level && { level: filters.level }),
            ...(filters.topic && { topic: filters.topic }),
            ...(filters.careerTrackId && { careerTrackId: filters.careerTrackId }),
            ...(filters.language && { language: filters.language }),
            ...(filters.typeContent && { typeContent: filters.typeContent }),
        };

        return response;
    }
}
