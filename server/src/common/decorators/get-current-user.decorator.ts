import { Request } from 'express';

import { JwtPayloadWithRt } from '@auth/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser: (data?: keyof JwtPayloadWithRt) => ParameterDecorator = createParamDecorator(
	(data: keyof JwtPayloadWithRt | undefined, ctx: ExecutionContext) => {
		const request: Request = ctx.switchToHttp().getRequest();
		return data ? request.user[data] : request.user;
	}
);
