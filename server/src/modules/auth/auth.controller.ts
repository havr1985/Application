import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import {
  AppConfig,
  appConfig,
  JwtConfig,
  jwtConfig,
} from '../../config/configuration';
import { Request, Response } from 'express';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

const REFRESH_COOKIE_NAME = 'refresh_token';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly refreshCookieMaxAge: number;
  private readonly refreshCookiePath: string;
  constructor(
    private readonly authService: AuthService,
    @Inject(appConfig.KEY) private readonly app: AppConfig,
    @Inject(jwtConfig.KEY) private readonly jwt: JwtConfig,
  ) {
    this.refreshCookiePath = `${app.globalPrefix}/auth/refresh`;
    this.refreshCookieMaxAge = this.parseToMs(this.jwt.refreshExpiresIn);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { auth, refreshToken } = await this.authService.register(dto);
    this.setRefreshCookie(res, refreshToken);
    return auth;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { auth, refreshToken } = await this.authService.login(dto);
    this.setRefreshCookie(res, refreshToken);
    return auth;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using httpOnly cookie' })
  @ApiCookieAuth('refresh_token')
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const oldRefreshToken = this.getRefreshToken(req);
    const { auth, refreshToken } =
      await this.authService.refreshToken(oldRefreshToken);
    this.setRefreshCookie(res, refreshToken);
    return auth;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and remove refresh token' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    this.clearRefreshCookie(res);
    return { message: 'Logged out successfully' };
  }

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie(REFRESH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: this.refreshCookiePath,
      maxAge: this.refreshCookieMaxAge,
    });
  }

  private getRefreshToken(req: Request): string {
    const token = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }
    return token;
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: this.refreshCookiePath,
    });
  }

  private parseToMs(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) throw new Error(`Invalid expiresIn: ${expiresIn}`);

    const value = parseInt(match[1], 10);
    const multipliers: Record<string, number> = {
      s: 1_000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };

    return value * multipliers[match[2]];
  }
}
