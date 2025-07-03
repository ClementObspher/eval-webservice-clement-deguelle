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
        return reservations
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
        return {
            id: reservation.id,
            user: { id: reservation.user_id },
            room: { id: reservation.room_id },
            startTime: reservation.start_time,
            endTime: reservation.end_time,
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiCreatedResponse({ description: 'Réservation créée avec succès' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async createReservation(@Body() body: CreateReservationDto) {
        const reservationCreated = await this.reservationsService.create(body)
        return {
            id: reservationCreated.id,
            user: { id: reservationCreated.user_id },
            room: { id: reservationCreated.room_id },
            startTime: reservationCreated.start_time,
            endTime: reservationCreated.end_time,
            status: reservationCreated.status,
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Réservation mise à jour avec succès' })
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiNotFoundResponse({ description: 'Réservation non trouvée' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async updateReservation(@Param('id') id: number, @Body() body: UpdateReservationDto) {
        console.log('Body reçu dans updateReservation:', body)
        // Compatibilité tests : mappe camelCase vers snake_case si besoin
        if (body.startTime && !body.start_time) body.start_time = body.startTime
        if (body.endTime && !body.end_time) body.end_time = body.endTime

        const reservation = await this.reservationsService.findOne(id)
        if (!reservation) {
            throw new NotFoundException(`Reservation ${id} not found`)
        }
        const reservationUpdated = await this.reservationsService.update(id, body)
        return {
            id: reservationUpdated.id,
            user: { id: reservationUpdated.user_id },
            room: { id: reservationUpdated.room_id },
            startTime: new Date(reservationUpdated.start_time).toISOString(),
            endTime: new Date(reservationUpdated.end_time).toISOString(),
            status: reservationUpdated.status,
        }
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
