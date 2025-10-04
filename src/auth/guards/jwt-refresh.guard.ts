// src/auth/guards/jwt-refresh.guard.ts
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
