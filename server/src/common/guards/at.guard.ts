import { Observable } from 'rxjs';

import { IS_PUBLIC, JWT } from '@common/constants';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard(JWT) {
	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		return this.reflector.getAllAndOverride(IS_PUBLIC, [ctx.getHandler(), ctx.getClass()]) ?? super.canActivate(ctx);
	}
}
