import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as argon2 from 'argon2';
import { JwtConfig, jwtConfig } from '../../config/configuration';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwt: JwtConfig,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ auth: AuthResponseDto; refreshToken: string }> {
    const existingUser = await this.usersService.findOneByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(
        `User with email ${dto.email} already exists`,
      );
    }
    const hashPassword = await argon2.hash(dto.password);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashPassword,
    });
    return this.generateAuthResponse(user);
  }

  async login(
    dto: LoginDto,
  ): Promise<{ auth: AuthResponseDto; refreshToken: string }> {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      await argon2.hash('dummy-password');
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await argon2.verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.generateAuthResponse(user);
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ auth: AuthResponseDto; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: this.jwt.refreshSecret,
      });
      const user = await this.usersService.findOneById(payload.sub);

      return this.generateAuthResponse(user);
    } catch {
      throw new UnauthorizedException('Refresh token invalid');
    }
  }

  private generateAuthResponse(user: User): {
    auth: AuthResponseDto;
    refreshToken: string;
  } {
    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwt.accessSecret,
      expiresIn: this.jwt.expiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwt.refreshSecret,
      expiresIn: this.jwt.refreshExpiresIn,
    });
    return {
      auth: { accessToken, user },
      refreshToken,
    };
  }
}
