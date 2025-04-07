import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getUserByEmailPassword(email: string, password: string): Promise<any> {
        const user = await this.userRepository.findOne({ where: { email, password } })
        if (user) {
            const { password, ...result } = user
            return result
        }
        return null
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id }
        return {
            accessToken: this.jwtService.sign(payload),
        }
    }
}
