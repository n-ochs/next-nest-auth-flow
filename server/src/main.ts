import * as cookieParser from 'cookie-parser';

import { AppModule } from '@app/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PrismaService } from '@prismaModule/prisma.service';

async function bootstrap(): Promise<void> {
	// Create App
	const app: INestApplication = await NestFactory.create(AppModule);

	// Set Globals
	app.setGlobalPrefix('/api');
	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe());
	app.enableCors({
		methods: '*',
		origin: 'http://localhost:3000',
		exposedHeaders: '*',
		credentials: true
	});

	// Enable Prisma
	const prismaService: PrismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);

	// Listen
	await app.listen(8080);
}

bootstrap();
