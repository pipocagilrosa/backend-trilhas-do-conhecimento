import { IsOptional, IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class FilterCoursesDto {
    @IsNotEmpty()
    @IsString()
    careerTrackId: string; // Filtrar por trilha específica (OBRIGATÓRIO)

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
    language?: string; // Idioma do curso

    @IsOptional()
    @IsString()
    typeContent?: string; // Tipo de conteúdo
}
