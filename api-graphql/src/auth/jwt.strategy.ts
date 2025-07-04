import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import * as jwksRsa from 'jwks-rsa'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${process.env.KEYCLOAK_URL || 'http://localhost:8080'}/realms/reservation-realm/protocol/openid-connect/certs`,
            }),
            algorithms: ['RS256'],
        })
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            username: payload.preferred_username,
            email: payload.email,
            roles: payload.realm_access?.roles || [],
        }
    }
}
