import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'Topic is required' })
    @IsString({ message: 'Topic must be a string' })
    topic: string;

    @IsNotEmpty({ message: 'Level is required' })
    @IsString({ message: 'Level must be a string' })
    level: string;

    @IsNotEmpty({ message: 'CareerTrackId is required' })
    @IsUUID('4', { message: 'CareerTrackId must be a valid UUID' })
    careerTrackId: string;
}