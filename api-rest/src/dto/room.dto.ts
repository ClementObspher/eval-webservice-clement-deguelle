import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator'
import { ApiProperty, PartialType } from '@nestjs/swagger'

export class CreateRoomDto {
    @ApiProperty({ example: 'Salle de réunion 101' })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({ example: 10 })
    @IsNotEmpty()
    @IsNumber()
    capacity: number

    @ApiProperty({ example: 'Paris - La Défense', required: false })
    @IsOptional()
    @IsString()
    location?: string
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
