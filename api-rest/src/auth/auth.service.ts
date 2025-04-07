import { Injectable } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class AuthService {
    async loginWithKeycloak(email: string, password: string): Promise<string> {
        const KEYCLOAK_URL = 'http://localhost:8080'
        const REALM = 'myrealm'
        const CLIENT_ID = 'myclient'
        const CLIENT_SECRET = 'mysecret'

        try {
            const response = await axios.post(
                `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
                new URLSearchParams({
                    client_id: CLIENT_ID,
                    grant_type: 'password',
                    username: email,
                    password: password,
                    client_secret: CLIENT_SECRET,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            )

            return response.data.access_token
        } catch (error) {
            console.error('Erreur Keycloak Login', error.response?.data)
            throw new Error('Invalid credentials')
        }
    }
}
