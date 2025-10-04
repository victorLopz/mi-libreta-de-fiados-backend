// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

type JwtPayload = { sub: number; email: string; tokenVersion: number };

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private jwt: JwtService,
  ) {}

  private async signTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email!,
      tokenVersion: user.token_version,
    };
    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
      }),
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
      }),
    ]);
    return { access_token, refresh_token };
  }

  async register(dto: RegisterDto) {
    const exists = await this.users.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already in use');

    const password_hash = await bcrypt.hash(dto.password, 12);
    const user = await this.users.save(
      this.users.create({
        name: dto.name,
        email: dto.email,
        password_hash,
      }),
    );
    const tokens = await this.signTokens(user);
    await this.updateRefreshHash(user.id, tokens.refresh_token);
    return {
      user: { id: user.id, name: user.name, email: user.email },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.signTokens(user);
    await this.updateRefreshHash(user.id, tokens.refresh_token);
    return {
      user: { id: user.id, name: user.name, email: user.email },
      ...tokens,
    };
  }

  async refresh(
    userId: number,
    tokenVersion: number,
    providedRefreshToken: string,
  ) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    // Verifica que el versioning coincida (revocación global)
    if (user.token_version !== tokenVersion) throw new UnauthorizedException();

    // Compara el refresh token recibido con el hash guardado
    const ok =
      user.refresh_token_hash &&
      (await bcrypt.compare(providedRefreshToken, user.refresh_token_hash));
    if (!ok) throw new UnauthorizedException();

    // Rotación: emitimos nuevo par y guardamos nuevo hash
    const tokens = await this.signTokens(user);
    await this.updateRefreshHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.users.update({ id: userId }, { refresh_token_hash: null });
    return { ok: true };
  }

  async revokeAll(userId: number) {
    // Incrementa token_version para invalidar todos los refresh emitidos
    await this.users.increment({ id: userId }, 'token_version', 1);
    await this.users.update({ id: userId }, { refresh_token_hash: null });
    return { ok: true };
  }

  private async updateRefreshHash(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 12);
    await this.users.update({ id: userId }, { refresh_token_hash: hash });
  }
}
