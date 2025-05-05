import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CareerTrackService } from "./career-track.service";
import { CreateCareerTrackDto } from "./dto/career-track.dto";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "src/enums/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { FindAllCareerTrackResponse } from "./dto/find-all-career-track.response";
import { GetCareerTrackResponse } from "./dto/get-career-track.response";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CategoryCourse } from "./entity/category-course.entity";
import { FindAllCareerCategoriesResponse } from "./dto/find-all-career-categories-response.dto";
import { Public } from "src/auth/publicRoutes/public";

@Controller('career-tracks')
export class CareerTrackController {
    constructor(private readonly careerTrackService: CareerTrackService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async create(@Body() createCareerTrackDto: CreateCareerTrackDto) {
        return this.careerTrackService.create(createCareerTrackDto);
    }

    @Get()

    async findAll() {
        const allCareerTracks = await this.careerTrackService.findAll();
        return allCareerTracks.map(careerTrack => FindAllCareerTrackResponse.convertFindAllCareerTrackDomainToResponse(careerTrack));
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const careerTrack = await this.careerTrackService.findOne(id);
        return GetCareerTrackResponse.convertCareerTrackDomainToResponse(careerTrack);
    }


    @Post('/categories')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryCourse> {
        return this.careerTrackService.createCategory(createCategoryDto);
    }

    @Get('/:id/categories/authenticated')
    @UseGuards(JwtAuthGuard)
    async findAuthenticatedCategoriesByCareerTrackId(
        @Param('id') careerTrackId: string,
        @Req() request: any,
    ): Promise<FindAllCareerCategoriesResponse> {
        const userId = request.user?.userId || null;
        const careerTrackWithCategories = await this.careerTrackService.findCategoriesWithSubscription(careerTrackId, userId);
        return FindAllCareerCategoriesResponse.fromDomainToResponse(careerTrackWithCategories);
    }

    @Get('/:id/categories')
    async findCategoriesByCareerTrackId(@Param('id') careerTrackId: string): Promise<FindAllCareerCategoriesResponse> {
        const careerTrackWithCategories = await this.careerTrackService.findCategoriesByCareerTrackId(careerTrackId);
        return FindAllCareerCategoriesResponse.fromDomainToResponse(careerTrackWithCategories);
    }

    @Patch('/:id/disable')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async disableCareer(@Param('id') careerTrackId: string): Promise<{ message: string }> {
        await this.careerTrackService.disableCareer(careerTrackId);
        return { message: 'Career disabled successfully' };
    }

    @Patch('/categories/:id/disable')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async disableCategory(@Param('id') categoryId: string): Promise<{ message: string }> {
        await this.careerTrackService.disableCategory(categoryId);
        return { message: 'Category disabled successfully' };
    }

    @Post('/enroll')
    @UseGuards(JwtAuthGuard)
    async enrollCareerTrack(
        @Req() request: any,
        @Body('careerTrackId') careerTrackId: string,
    ): Promise<{ message: string }> {
        const userId = request.user.userId; // Obtém o ID do usuário logado do token JWT
        await this.careerTrackService.enrollUserInCareerTrack(userId, [careerTrackId]);
        return { message: 'Successfully enrolled in the career track' };
    }
}