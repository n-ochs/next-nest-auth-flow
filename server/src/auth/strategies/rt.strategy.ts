import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { JwtPayload, JwtPayloadWithRt } from '@auth/types';
import { JWT_REFRESH, REFRESH_TOKEN } from '@common/constants';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, JWT_REFRESH) {
	constructor() {
		super({
			jwtFromRequest: RtStrategy.extractRtJwtFromCookie,
			secretOrKey: process.env.RT_SECRET,
			passReqToCallback: true
		});
	}

	private static extractRtJwtFromCookie(req: Request): string | null {
		if (req.cookies && REFRESH_TOKEN in req.cookies) {
			return req.cookies[REFRESH_TOKEN];
		}
		return null;
	}

	// Validate JWT Signature & attach Refresh Token to request
	validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
		const refreshToken: string = req?.cookies[REFRESH_TOKEN];

		if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

		return {
			...payload,
			refreshToken
		};
	}
}
