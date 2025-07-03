import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, PartialType } from '@nestjs/swagger'

export class CreateReservationDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    user_id: number

    @ApiProperty({ example: 2 })
    @IsNotEmpty()
    @IsNumber()
    room_id: number

    @ApiProperty({ example: '2025-03-20T10:00:00Z' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    start_time: Date

    @ApiProperty({ example: '2025-03-20T12:00:00Z' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    end_time: Date

    @ApiProperty({ example: 'pending' })
    @IsNotEmpty()
    status: string
}

export class UpdateReservationDto {
    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumber()
    user_id?: number

    @ApiProperty({ example: 2, required: false })
    @IsOptional()
    @IsNumber()
    room_id?: number

    @ApiProperty({ example: '2025-03-20T10:00:00Z', required: false })
    @IsOptional()
    start_time?: Date | string

    @ApiProperty({ example: '2025-03-20T12:00:00Z', required: false })
    @IsOptional()
    end_time?: Date | string

    @ApiProperty({ example: 'pending', required: false })
    @IsOptional()
    status?: string

    // Rétrocompatibilité avec les anciens noms
    @ApiProperty({ example: '2025-03-20T10:00:00Z', required: false })
    @IsOptional()
    startTime?: Date | string

    @ApiProperty({ example: '2025-03-20T12:00:00Z', required: false })
    @IsOptional()
    endTime?: Date | string
}
