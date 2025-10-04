// src/auth/strategies/jwt-refresh.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { JwtFromRequestFunction } from 'passport-jwt';
import type { Request } from 'express';
import type { JwtPayload } from '../types';

const cookieExtractor: JwtFromRequestFunction = (req: Request) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  req?.cookies?.rt ?? null;

const authHeaderExtractor: JwtFromRequestFunction = (req: Request) => {
  const h = req?.headers?.authorization;
  if (!h || Array.isArray(h)) return null;
  return h.startsWith('Bearer ') ? h.slice(7) : null;
};

const refreshExtractor: JwtFromRequestFunction = (req) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  cookieExtractor(req) ?? authHeaderExtractor(req);

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      jwtFromRequest: refreshExtractor,
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
      passReqToCallback: false,
      ignoreExpiration: false,
    });
  }
  validate(payload: JwtPayload) {
    if (!payload?.sub) throw new UnauthorizedException();
    return payload;
  }
}
