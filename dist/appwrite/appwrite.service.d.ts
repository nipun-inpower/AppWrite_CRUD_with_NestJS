import { Client } from 'node-appwrite';
import { ConfigService } from '@nestjs/config';
export declare class AppwriteService {
    private configService;
    private client;
    constructor(configService: ConfigService);
    getClient(): Client;
}
