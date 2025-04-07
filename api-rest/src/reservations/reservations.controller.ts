import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpStatus, NotFoundException, Res } from '@nestjs/common'
import { ReservationsService } from './reservations.service'
import {
    ApiTags,
    ApiBearerAuth,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiUnauthorizedResponse,
    ApiNotFoundResponse,
    ApiNoContentResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard'
import { CreateReservationDto, UpdateReservationDto } from 'src/dto/reservation.dto'
import { Response } from 'express'

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('api/reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Liste des réservations récupérée avec succès' })
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async getReservations(@Query('skip') skip = 0, @Query('limit') limit = 10) {
        const reservations = await this.reservationsService.findAll(skip, limit)
        return {
            reservations: reservations,
            statusCode: HttpStatus.OK,
            message: 'Reservations fetched successfully',
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Réservation récupérée avec succès' })
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiNotFoundResponse({ description: 'Réservation non trouvée' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async getReservation(@Param('id') id: number) {
        const reservation = await this.reservationsService.findOne(id)
        if (!reservation) {
            throw new NotFoundException(`Reservation ${id} not found`)
        }
        return reservation
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiCreatedResponse({ description: 'Réservation créée avec succès' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async createReservation(@Body() body: CreateReservationDto) {
        const reservationCreated = await this.reservationsService.create(body)
        return reservationCreated
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Réservation mise à jour avec succès' })
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiNotFoundResponse({ description: 'Réservation non trouvée' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async updateReservation(@Param('id') id: number, @Body() body: UpdateReservationDto) {
        const reservation = await this.reservationsService.findOne(id)
        if (!reservation) {
            throw new NotFoundException(`Reservation ${id} not found`)
        }
        const reservationUpdated = await this.reservationsService.update(id, body)
        return reservationUpdated
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiNoContentResponse({ description: 'Réservation supprimée avec succès' })
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiNotFoundResponse({ description: 'Réservation non trouvée' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async deleteReservation(@Param('id') id: number, @Res() res: Response) {
        const reservation = await this.reservationsService.findOne(id)
        if (!reservation) {
            throw new NotFoundException(`Reservation ${id} not found`)
        }
        await this.reservationsService.remove(id)
        return res.status(HttpStatus.NO_CONTENT).send()
    }
}
