import { AppService } from './app.service';
import { AppwriteService } from './appwrite/appwrite.service';
export declare class AppController {
    private readonly appService;
    private readonly appwriteService;
    constructor(appService: AppService, appwriteService: AppwriteService);
    getHello(): string;
}
