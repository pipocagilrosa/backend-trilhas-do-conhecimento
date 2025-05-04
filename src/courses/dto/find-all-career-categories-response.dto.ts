export class FindAllCareerCategoriesResponse {
    id: string;
    title: string;
    area: string;
    description: string;
    subTitle: string;
    contentImage?: string;
    content: string;
    image: string;
    contentTitle: string;
    contentSubtitle: string;
    index: number;
    categories: {
        level: string;
        items: {
            id: string;
            topic: string;
        }[];
    }[];

    static fromDomainToResponse(careerTrack: any): FindAllCareerCategoriesResponse {
        const groupedCategories = careerTrack.categoryCourse.reduce((acc, category) => {
            const levelGroup = acc.find(group => group.level === category.level);
            if (levelGroup) {
                levelGroup.items.push({
                    id: category.id,
                    topic: category.topic,
                });
            } else {
                acc.push({
                    level: category.level,
                    items: [
                        {
                            id: category.id,
                            topic: category.topic,
                        },
                    ],
                });
            }
            return acc;
        }, [] as { level: string; items: { id: string; topic: string }[] }[]);

        return {
            id: careerTrack.id,
            title: careerTrack.title,
            area: careerTrack.area,
            description: careerTrack.description,
            subTitle: careerTrack.subTitle,
            content: careerTrack.content,
            image: careerTrack.image,
            contentImage: careerTrack.contentImage || '',
            contentTitle: careerTrack.contentTitle,
            contentSubtitle: careerTrack.contentSubtitle,
            index: careerTrack.index,
            categories: groupedCategories,
        };
    }
}