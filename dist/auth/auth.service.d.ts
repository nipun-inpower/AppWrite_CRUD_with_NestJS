import { AppwriteService } from '../appwrite/appwrite.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InitiateRecoveryDto, CompleteRecoveryDto } from './dto/password-recovery.dto';
export declare class AuthService {
    private appwriteService;
    private account;
    private databases;
    private readonly DATABASE_ID;
    private readonly COLLECTION_ID;
    private readonly RECOVERY_URL;
    private readonly MALE_PROFILE_IMAGE;
    private readonly FEMALE_PROFILE_IMAGE;
    constructor(appwriteService: AppwriteService);
    initiatePasswordRecovery(dto: InitiateRecoveryDto): Promise<{
        message: string;
    }>;
    completePasswordRecovery(dto: CompleteRecoveryDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        session: {
            sessionId: string;
            userId: string;
            provider: string;
            providerUid: string;
            providerEmail: string;
        };
        user: any;
    }>;
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            gender: string;
            profileImage: string;
            createdAt: string;
        };
    }>;
    getCurrentUser(sessionId: string): Promise<{
        id: any;
        email: any;
        fullName: any;
        gender: any;
        profileImage: any;
    }>;
    checkLoginStatus(sessionId: string): Promise<{
        isLoggedIn: boolean;
        session: {
            sessionId: string;
            userId: string;
            provider: string;
            providerEmail: string;
        };
        user: {
            id: any;
            email: any;
            fullName: any;
            gender: any;
            profileImage: any;
        };
        message?: undefined;
    } | {
        isLoggedIn: boolean;
        message: any;
        session?: undefined;
        user?: undefined;
    }>;
    getUserById(userId: string): Promise<{
        fullName: any;
        gender: any;
        email: any;
        profileImage: any;
    }>;
}
