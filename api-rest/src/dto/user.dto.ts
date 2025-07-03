import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

export class LoginDto {
    @ApiProperty({ example: 'test@test.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({ example: 'password' })
    @IsNotEmpty()
    password: string
}

export class CreateUserDto {
    @ApiProperty({ example: 'test@test.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({ example: 'password' })
    @IsNotEmpty()
    password: string

    @ApiProperty({ example: 'john_doe', required: false })
    @IsOptional()
    username?: string

    @ApiProperty({ example: 'John', required: false })
    @IsOptional()
    firstName?: string

    @ApiProperty({ example: 'Doe', required: false })
    @IsOptional()
    lastName?: string
}
