import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpStatus, NotFoundException } from '@nestjs/common'
import { UsersService } from './users.service'
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiCreatedResponse } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard'
import { ReservationsService } from 'src/reservations/reservations.service'
import { CsvExportService } from 'src/common/csv-export.service'
import { CreateUserDto } from 'src/dto/user.dto'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly reservationsService: ReservationsService,
        private readonly csvExportService: CsvExportService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Liste des utilisateurs récupérée avec succès' })
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async getUsers(@Query('skip') skip = 0, @Query('limit') limit = 10) {
        const res = await this.usersService.findAll(skip, limit)
        return {
            users: res,
            statusCode: HttpStatus.OK,
            message: 'Users fetched successfully',
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Utilisateur récupéré avec succès' })
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiNotFoundResponse({ description: 'Utilisateur non trouvé' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async getUser(@Param('id') id: string) {
        const userId = parseInt(id, 10)
        if (isNaN(userId)) {
            throw new NotFoundException('Invalid user ID format')
        }
        const user = await this.usersService.findOne(userId)
        if (!user) {
            throw new NotFoundException(`User ${userId} not found`)
        }
        return {
            id: user.id,
            email: user.email,
            keycloakId: user.keycloak_id,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({ description: 'Utilisateur créé avec succès' })
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async createUser(@Body() body: CreateUserDto) {
        const userCreated = await this.usersService.create(body)
        return {
            id: userCreated.id,
            email: userCreated.email,
            keycloakId: userCreated.keycloak_id,
            createdAt: userCreated.created_at,
            updatedAt: userCreated.updated_at,
        }
    }

    // @Put(':id')
    // @UseGuards(JwtAuthGuard)
    // updateUser(@Param('id') id: number, @Body() body: User) {
    //     const user = this.usersService.findOne(id)
    //     if (!user) {
    //         return {
    //             data: null,
    //             statusCode: HttpStatus.NOT_FOUND,
    //             message: `User ${id} not found`,
    //         }
    //     }
    //     const userUpdated = this.usersService.update(id, body)
    //     return {
    //         data: userUpdated,
    //         statusCode: HttpStatus.OK,
    //         message: 'User updated successfully',
    //     }
    // }

    // @Delete(':id')
    // @UseGuards(JwtAuthGuard)
    // deleteUser(@Param('id') id: number) {
    //     const user = this.usersService.findOne(id)
    //     if (!user) {
    //         return {
    //             data: null,
    //             statusCode: HttpStatus.NOT_FOUND,
    //             message: `User ${id} not found`,
    //         }
    //     }
    //     this.usersService.remove(id)
    //     return {
    //         data: null,
    //         statusCode: HttpStatus.NO_CONTENT,
    //         message: 'User deleted successfully',
    //     }
    // }

    @UseGuards(JwtAuthGuard)
    @Post(':id/extract')
    @ApiOkResponse({ description: 'Extraction des réservations effectuée avec succès' })
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiNotFoundResponse({ description: 'Utilisateur non trouvé' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async extractReservations(@Param('id') id: number) {
        const user = await this.usersService.findOne(id)

        if (!user) {
            throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`)
        }

        const reservations = await this.reservationsService.findByUser(id)

        if (!reservations || reservations.length === 0) {
            throw new NotFoundException(`Aucune réservation trouvée pour l'utilisateur ${id}`)
        }

        const fileUrl = await this.csvExportService.generateCsvAndUpload(user.email, reservations)

        return {
            statusCode: 200,
            message: 'Fichier CSV généré avec succès',
            url: fileUrl,
        }
    }
}
