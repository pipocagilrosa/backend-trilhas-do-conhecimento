import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, Logger } from "@nestjs/common";
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
import { UserEnrolledCareerTrackResponse } from "./dto/user-enrolled-career-track.response.dto";
import { MyCareerTrackSummaryResponse } from "./dto/my-career-track-summary.response.dto";
import { CareerTrackParamDto } from "./dto/career-track-param.dto";
import { BadRequestException } from "@nestjs/common";
import { AllCategoriesResponseDto } from "./dto/all-categories-response.dto";

@Controller('career-tracks')
export class CareerTrackController {
    private readonly logger = new Logger(CareerTrackController.name);

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


    @Get('/categories')
    @Public()
    async findAllCategories(): Promise<AllCategoriesResponseDto[]> {
        const categories = await this.careerTrackService.findAllCategories();
        return AllCategoriesResponseDto.fromCategoryEntities(categories);
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

    @Get('/my-enrollments')
    @UseGuards(JwtAuthGuard)
    async findMyEnrolledCareerTracks(
        @Req() request: any,
    ): Promise<UserEnrolledCareerTrackResponse[]> {
        try {
            const userId = request.user?.userId;
            if (!userId) {
                throw new BadRequestException('Token JWT inválido ou usuário não encontrado');
            }

            this.logger.log(`User ${userId} accessing enrolled career tracks`);
            const careerTracks = await this.careerTrackService.findUserEnrolledCareerTracks(userId);

            return careerTracks.map(careerTrack => {
                try {
                    return UserEnrolledCareerTrackResponse.fromCareerTrackWithCategories(careerTrack);
                } catch (error) {
                    this.logger.error(`Error converting career track ${careerTrack.id} to response`, error);
                    throw new BadRequestException(`Erro ao processar dados da carreira ${careerTrack.title || 'desconhecida'}`);
                }
            });
        } catch (error) {
            this.logger.error(`Error in findMyEnrolledCareerTracks for user ${request.user?.userId}`, error);
            throw error;
        }
    }

    @Get('/my-enrollments/summary')
    @UseGuards(JwtAuthGuard)
    async findMyEnrolledCareerTracksSummary(
        @Req() request: any,
    ): Promise<MyCareerTrackSummaryResponse[]> {
        try {
            const userId = request.user?.userId;
            if (!userId) {
                throw new BadRequestException('Token JWT inválido ou usuário não encontrado');
            }

            this.logger.log(`User ${userId} accessing enrolled career tracks summary`);
            const careerTracks = await this.careerTrackService.findUserEnrolledCareerTracks(userId);

            return careerTracks.map(careerTrack => {
                try {
                    return MyCareerTrackSummaryResponse.fromCareerTrack(careerTrack);
                } catch (error) {
                    this.logger.error(`Error converting career track ${careerTrack.id} to summary`, error);
                    throw new BadRequestException(`Erro ao processar resumo da carreira ${careerTrack.title || 'desconhecida'}`);
                }
            });
        } catch (error) {
            this.logger.error(`Error in findMyEnrolledCareerTracksSummary for user ${request.user?.userId}`, error);
            throw error;
        }
    }

    @Get('/my-enrollments/:id')
    @UseGuards(JwtAuthGuard)
    async findMyEnrolledCareerTrackById(
        @Req() request: any,
        @Param() params: CareerTrackParamDto,
    ): Promise<UserEnrolledCareerTrackResponse> {
        try {
            const userId = request.user?.userId;
            if (!userId) {
                throw new BadRequestException('Token JWT inválido ou usuário não encontrado');
            }

            const { id: careerTrackId } = params;
            this.logger.log(`User ${userId} accessing enrolled career track ${careerTrackId}`);

            const careerTrack = await this.careerTrackService.findUserEnrolledCareerTrackById(userId, careerTrackId);

            try {
                return UserEnrolledCareerTrackResponse.fromCareerTrackWithCategories(careerTrack);
            } catch (error) {
                this.logger.error(`Error converting career track ${careerTrackId} to response`, error);
                throw new BadRequestException(`Erro ao processar dados da carreira ${careerTrack.title || 'desconhecida'}`);
            }
        } catch (error) {
            this.logger.error(`Error in findMyEnrolledCareerTrackById for user ${request.user?.userId}`, error);
            throw error;
        }
    }
}