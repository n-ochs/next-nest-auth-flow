import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
	@Get()
	testing(): { message: string } {
		return { message: '/app get request successful' };
	}
}
