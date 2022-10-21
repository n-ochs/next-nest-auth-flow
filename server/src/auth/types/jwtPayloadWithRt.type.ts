import { JwtPayload } from '@auth/types';

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
