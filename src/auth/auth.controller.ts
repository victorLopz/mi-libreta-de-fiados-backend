/* eslint-disable @typescript-eslint/no-unsafe-argument */
// src/auth/auth.controller.ts
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.auth.register(dto);
    // refresh como cookie httpOnly (opcional)
    res.cookie('rt', r.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    return { user: r.user, access_token: r.access_token };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.auth.login(dto);
    res.cookie('rt', r.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    return { user: r.user, access_token: r.access_token };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @CurrentUser('sub') sub: number,
    @CurrentUser('tokenVersion') tokenVersion: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const rt = (res.req as any)?.cookies?.rt || (res.req as any)?.refreshToken;
    const tokens = await this.auth.refresh(sub, tokenVersion, rt);
    res.cookie('rt', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    return { access_token: tokens.access_token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser('sub') sub: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.auth.logout(sub);
    res.clearCookie('rt', { path: '/' });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { user };
  }
}
