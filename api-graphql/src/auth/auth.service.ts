/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserByEmailPassword(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email, password },
    });
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: { username: string; id: string }) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async loginWithKeycloak(email: string, password: string): Promise<string> {
    const KEYCLOAK_URL = 'http://localhost:8080';
    const REALM = 'myrealm';
    const CLIENT_ID = 'myclient';
    const CLIENT_SECRET = 'mysecret';

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
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Erreur Keycloak Login', error.response?.data);
      throw new Error('Invalid credentials');
    }
  }
}
