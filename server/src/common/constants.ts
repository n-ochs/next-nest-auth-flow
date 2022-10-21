import { JwtPayloadWithRt, Tokens } from '@auth/types';

export const IS_PUBLIC: string = 'isPublic';
export const JWT: string = 'jwt';
export const JWT_REFRESH: string = 'jwt-refresh';
export const ACCESS_TOKEN: keyof Tokens = 'accessToken';
export const REFRESH_TOKEN: keyof JwtPayloadWithRt = 'refreshToken';
