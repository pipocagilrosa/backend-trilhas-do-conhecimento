import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCareerTrackDto {
  @IsNotEmpty({ message: 'Field is required' })
  @IsString({ message: 'Field must be a string' })
  area: string;

  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Sub Title is required' })
  @IsString({ message: 'Sub Title must be a string' })
  subTitle: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  content: string;

  @IsNotEmpty({ message: 'Image is required' })
  @IsString({ message: 'Image must be a string' })
  image: string;

  @IsNotEmpty({ message: 'Content Title is required' })
  @IsString({ message: 'Content Title must be a string' })
  contentTitle: string;

  @IsString({ message: 'Content Image must be a string' })
  contentImage?: string;

  @IsNotEmpty({ message: 'Content Subtitle Title is required' })
  @IsString({ message: 'Content Subtitle must be a string' })
  contentSubtitle: string;

  @IsOptional()
  @IsNumber({}, { message: 'Index must be a number' })
  index?: number;
}