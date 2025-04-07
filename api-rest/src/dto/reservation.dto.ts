import { IsDate, IsNotEmpty, IsNumber } from 'class-validator'
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
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
