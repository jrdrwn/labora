import jwtTypes from 'hono/utils/jwt/types';

type JWTPayload = jwtTypes.JWTPayload & {
  sub: number;
  role: 'admin' | 'asisten' | 'praktikan';
};
