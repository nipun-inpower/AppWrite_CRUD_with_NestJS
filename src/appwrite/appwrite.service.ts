import { Injectable } from '@nestjs/common';
import { Client } from 'node-appwrite';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppwriteService {
  private client: Client;

  constructor(private configService: ConfigService) {
    this.client = new Client()
      .setEndpoint(this.configService.get<string>('APPWRITE_ENDPOINT'))
      .setProject(this.configService.get<string>('APPWRITE_PROJECT_ID'))
      .setKey(this.configService.get<string>('APPWRITE_API_KEY'));
  }

  getClient(): Client {
    return this.client;
  }
} 