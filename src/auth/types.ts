import type { Request } from 'express';

export type JwtPayload = {
  sub: number;
  email: string;
  tokenVersion: number;
};

export type RefreshExtractor = (req: Request) => string | null;

export function getRefreshToken(req: Request): string | null {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (
    req?.cookies?.rt ??
    (req?.headers?.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null)
  );
}
