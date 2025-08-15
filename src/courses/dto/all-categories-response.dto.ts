import { CategoryCourse } from '../entity/category-course.entity';

export class AllCategoriesResponseDto {
    id: string;
    topic: string;
    level: string;
    careerTrackId: string;
    careerTrackTitle: string;

    constructor(
        id: string,
        topic: string,
        level: string,
        careerTrackId: string,
        careerTrackTitle: string,
    ) {
        this.id = id;
        this.topic = topic;
        this.level = level;
        this.careerTrackId = careerTrackId;
        this.careerTrackTitle = careerTrackTitle;
    }

    static fromCategoryEntity(category: CategoryCourse): AllCategoriesResponseDto {
        return new AllCategoriesResponseDto(
            category.id,
            category.topic || 'N/A',
            category.level || 'N/A',
            category.careerTrack?.id || '',
            category.careerTrack?.title || 'N/A'
        );
    }

    static fromCategoryEntities(categories: CategoryCourse[]): AllCategoriesResponseDto[] {
        return categories.map(category => AllCategoriesResponseDto.fromCategoryEntity(category));
    }
}
