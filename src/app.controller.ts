import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppwriteService } from './appwrite/appwrite.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appwriteService: AppwriteService,
  ) {}

  @Get('hello')
  getHello(): string {
    // Test if Appwrite client is configured
    const client = this.appwriteService.getClient();
    return 'Hello World! Appwrite is configured successfully!';
  }
} 