import { AtStrategy, RtStrategy } from '@auth/strategies';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	imports: [JwtModule.register({})],
	providers: [AuthService, AtStrategy, RtStrategy],
	controllers: [AuthController]
})
export class AuthModule {}
