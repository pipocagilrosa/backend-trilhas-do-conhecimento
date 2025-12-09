import { IsOptional, IsString, IsEnum } from 'class-validator';

export class FilterCoursesDto {
    @IsOptional()
    @IsString()
    keyword1?: string;

    @IsOptional()
    @IsString()
    keyword2?: string;

    @IsOptional()
    @IsString()
    keyword3?: string;

    @IsOptional()
    @IsString()
    level?: string; // Iniciante, Intermediário, Avançado

    @IsOptional()
    @IsString()
    topic?: string; // Assunto/tópico do curso

    @IsOptional()
    @IsString()
    careerTrackId?: string; // Filtrar por trilha específica

    @IsOptional()
    @IsString()
    language?: string; // Idioma do curso

    @IsOptional()
    @IsString()
    typeContent?: string; // Tipo de conteúdo
}
