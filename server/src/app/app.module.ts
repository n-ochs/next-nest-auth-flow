import { AuthModule } from '@auth/auth.module';
import { AtGuard } from '@common/guards';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@prismaModule/prisma.module';
import { AppController } from './app.controller';

@Module({
	imports: [AuthModule, PrismaModule],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AtGuard
		}
	],
	controllers: [AppController]
})
export class AppModule {}
