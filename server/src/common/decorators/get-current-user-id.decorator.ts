import { Request } from 'express';

import { JwtPayload } from '@auth/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId: () => ParameterDecorator = createParamDecorator((_: undefined, ctx: ExecutionContext) => {
	const request: Request = ctx.switchToHttp().getRequest();
	const user: JwtPayload = request.user as JwtPayload;

	return user.sub;
});
