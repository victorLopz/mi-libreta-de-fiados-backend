import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BypassOrJwtGuard extends AuthGuard('jwt') {
  constructor(private readonly config: ConfigService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const disabled = this.config.get<string>('AUTH_DISABLED') === 'true';
    if (disabled) return true; // 🔓 sin token para pruebas locales
    return (await super.canActivate(context)) as boolean; // 🔒 JWT
  }
}
