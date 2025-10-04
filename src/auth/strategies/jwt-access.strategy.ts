// src/auth/strategies/jwt-access.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { JwtPayload } from '../types';
import type { JwtFromRequestFunction } from 'passport-jwt';
import type { Request } from 'express';

const bearerExtractor: JwtFromRequestFunction = (req: Request) => {
  const auth = req?.headers?.authorization;
  if (!auth || Array.isArray(auth)) return null;
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
};

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      jwtFromRequest: bearerExtractor,
      secretOrKey: process.env.JWT_ACCESS_SECRET!,
      ignoreExpiration: false,
    });
  }
  validate(payload: JwtPayload) {
    return payload;
  }
}
