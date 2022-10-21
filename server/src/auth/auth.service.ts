import * as argon from 'argon2';
import * as dayjs from 'dayjs';
import { Response as Res } from 'express';

import { AuthDto } from '@auth/dto';
import { JwtPayload, Tokens as Tokens } from '@auth/types';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@common/constants';
import { ForbiddenException, Injectable, Response } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '@prismaModule/prisma.service';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwtService: JwtService) {}

	async getTokens(userId: number, email: string): Promise<Tokens> {
		const jwtPayload: JwtPayload = {
			sub: userId,
			email: email
		};

		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(jwtPayload, {
				secret: process.env.AT_SECRET,
				expiresIn: '15m'
			}),
			this.jwtService.signAsync(jwtPayload, {
				secret: process.env.RT_SECRET,
				expiresIn: '2h'
			})
		]);

		return {
			accessToken: at,
			refreshToken: rt
		};
	}

	async updateRtHash(userId: number, rt: string): Promise<void> {
		const hash: string = await argon.hash(rt);

		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				hashedRt: hash
			}
		});
	}

	async signUp(dto: AuthDto, @Response({ passthrough: true }) res: Res): Promise<void> {
		// Hash password
		const hashedPassword: string = await argon.hash(dto.password);

		// Create user in DB
		const newUser: User = await this.prisma.user.create({
			data: {
				email: dto.email,
				hash: hashedPassword
			}
		});

		// Generate Tokens
		const tokens: Tokens = await this.getTokens(newUser.id, newUser.email);
		await this.updateRtHash(newUser.id, tokens.refreshToken);
		const accessTokenExp: Date = dayjs().add(15, 'm').toDate();
		const refreshTokenExp: Date = dayjs().add(2, 'h').toDate();

		// Send response with cookies
		res.cookie(ACCESS_TOKEN, tokens.accessToken, { httpOnly: true, secure: true, expires: accessTokenExp, sameSite: true, path: '/' }).cookie(
			REFRESH_TOKEN,
			tokens.refreshToken,
			{
				httpOnly: true,
				secure: true,
				expires: refreshTokenExp,
				sameSite: true,
				path: '/'
			}
		);
	}

	async signIn(dto: AuthDto, @Response({ passthrough: true }) res: Res): Promise<void> {
		// Find user
		const user: User = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});
		if (!user) throw new ForbiddenException('Access Denied');

		// Verify password & hash match
		const passwordMatches: boolean = await argon.verify(user.hash, dto.password);
		if (!passwordMatches) throw new ForbiddenException('Access Denied');

		// Generate Tokens
		const tokens: Tokens = await this.getTokens(user.id, user.email);
		await this.updateRtHash(user.id, tokens.refreshToken);
		const accessTokenExp: Date = dayjs().add(15, 'm').toDate();
		const refreshTokenExp: Date = dayjs().add(2, 'h').toDate();

		// Send response with cookies
		res.cookie(ACCESS_TOKEN, tokens.accessToken, { httpOnly: true, secure: true, expires: accessTokenExp, sameSite: true, path: '/' }).cookie(
			REFRESH_TOKEN,
			tokens.refreshToken,
			{
				httpOnly: true,
				secure: true,
				expires: refreshTokenExp,
				sameSite: true,
				path: '/'
			}
		);
	}

	async signOut(userId: number, @Response({ passthrough: true }) res: Res): Promise<void> {
		await this.prisma.user.updateMany({
			where: {
				id: userId,
				hashedRt: {
					not: null
				}
			},
			data: {
				hashedRt: null
			}
		});
		res.clearCookie(ACCESS_TOKEN).clearCookie(REFRESH_TOKEN);
	}

	async refreshTokens(userId: number, rt: string, @Response({ passthrough: true }) res: Res): Promise<void> {
		// Find the user
		const user: User = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		});
		if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

		// Verify refreshToken & hashedRt match
		const rtMatches: boolean = await argon.verify(user.hashedRt, rt);
		if (!rtMatches) throw new ForbiddenException('Access Denied');

		// Generate Tokens
		const tokens: Tokens = await this.getTokens(user.id, user.email);
		await this.updateRtHash(user.id, tokens.refreshToken);

		const accessTokenExp: Date = dayjs().add(15, 'm').toDate();
		const refreshTokenExp: Date = dayjs().add(2, 'h').toDate();

		// Send response with cookies
		res.cookie(ACCESS_TOKEN, tokens.accessToken, { httpOnly: true, secure: true, expires: accessTokenExp, sameSite: true, path: '/' }).cookie(
			REFRESH_TOKEN,
			tokens.refreshToken,
			{
				httpOnly: true,
				secure: true,
				expires: refreshTokenExp,
				sameSite: true,
				path: '/'
			}
		);
	}
}
