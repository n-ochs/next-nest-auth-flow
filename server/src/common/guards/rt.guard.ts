import { JWT_REFRESH } from '@common/constants';
import { AuthGuard } from '@nestjs/passport';

export class RtGuard extends AuthGuard(JWT_REFRESH) {
	constructor() {
		super();
	}
}
