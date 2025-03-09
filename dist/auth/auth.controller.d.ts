import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InitiateRecoveryDto, CompleteRecoveryDto } from './dto/password-recovery.dto';
export declare class AuthController {
    private readonly authService;
    private readonly FRONTEND_RECOVERY_URL;
    constructor(authService: AuthService);
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
    checkLoginStatus(sessionId?: string, fallbackSessionId?: string): Promise<{
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
    getCurrentUser(sessionId?: string, fallbackSessionId?: string): Promise<{
        id: any;
        email: any;
        fullName: any;
        gender: any;
        profileImage: any;
    }>;
    initiatePasswordRecovery(dto: InitiateRecoveryDto): Promise<{
        message: string;
    }>;
    handleRecoveryCallback(userId: string, secret: string, res: Response): Promise<void>;
    completePasswordRecovery(dto: CompleteRecoveryDto): Promise<{
        message: string;
    }>;
    getUserById(userId: string): Promise<{
        fullName: any;
        gender: any;
        email: any;
        profileImage: any;
    }>;
}
