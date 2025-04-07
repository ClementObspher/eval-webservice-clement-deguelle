import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpStatus, NotFoundException, Res } from '@nestjs/common'
import { RoomsService } from './rooms.service'
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
import { CreateRoomDto, UpdateRoomDto } from 'src/dto/room.dto'
import { Response } from 'express'

@ApiTags('Rooms')
@ApiBearerAuth()
@Controller('api/rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Liste des salles récupérée avec succès' })
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async getRooms(@Query('skip') skip = 0, @Query('limit') limit = 10) {
        const rooms = await this.roomsService.findAll(skip, limit)
        return {
            rooms: rooms,
            statusCode: HttpStatus.OK,
            message: 'Rooms fetched successfully',
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Salle récupérée avec succès' })
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiNotFoundResponse({ description: 'Salle non trouvée' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async getRoom(@Param('id') id: number) {
        const room = await this.roomsService.findOne(id)
        if (!room) {
            throw new NotFoundException(`Room ${id} not found`)
        }
        return room
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiCreatedResponse({ description: 'Salle créée avec succès' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async createRoom(@Body() body: CreateRoomDto) {
        const roomCreated = await this.roomsService.create(body)
        return roomCreated
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Salle mise à jour avec succès' })
    @ApiBadRequestResponse({ description: 'Requête invalide' })
    @ApiNotFoundResponse({ description: 'Salle non trouvée' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async updateRoom(@Param('id') id: number, @Body() body: UpdateRoomDto) {
        const room = await this.roomsService.findOne(id)
        if (!room) {
            throw new NotFoundException(`Room ${id} not found`)
        }
        const roomUpdated = this.roomsService.update(id, body)
        return roomUpdated
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiNoContentResponse({ description: 'Salle supprimée avec succès' })
    @ApiNotFoundResponse({ description: 'Salle non trouvée' })
    @ApiUnauthorizedResponse({ description: 'Non autorisé' })
    async deleteRoom(@Param('id') id: number, @Res() res: Response) {
        const room = await this.roomsService.findOne(id)
        if (!room) {
            throw new NotFoundException(`Room ${id} not found`)
        }
        await this.roomsService.remove(id)
        return res.status(HttpStatus.NO_CONTENT).send()
    }
}
