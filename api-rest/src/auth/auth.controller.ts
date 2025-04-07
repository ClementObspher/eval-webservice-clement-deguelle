import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags, ApiBody, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger'
import { LoginDto } from 'src/dto/user.dto'

@ApiTags('Auth')
@Controller('api')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiBody({
        schema: {
            example: {
                email: 'test@test.com',
                password: 'password',
            },
        },
    })
    @ApiOkResponse({ description: 'Token généré avec succès' })
    @ApiBadRequestResponse({ description: 'Identifiants invalides' })
    async login(@Body() body: LoginDto) {
        const { email, password } = body

        try {
            const accessToken = await this.authService.loginWithKeycloak(email, password)

            return {
                statusCode: HttpStatus.OK,
                message: 'Connexion réussie',
                accessToken,
            }
        } catch (error) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Identifiants invalides ou utilisateur inexistant',
                },
                HttpStatus.BAD_REQUEST,
            )
        }
    }
}
