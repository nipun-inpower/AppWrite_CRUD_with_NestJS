"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const appwrite_service_1 = require("../appwrite/appwrite.service");
const node_appwrite_1 = require("node-appwrite");
let AuthService = class AuthService {
    constructor(appwriteService) {
        this.appwriteService = appwriteService;
        this.DATABASE_ID = '67cbfe5200258ce8929d';
        this.COLLECTION_ID = '67cbfe5a00100d602269';
        this.RECOVERY_URL = 'http://localhost:3000/auth/recovery-callback';
        this.MALE_PROFILE_IMAGE = 'https://cloud.appwrite.io/v1/storage/buckets/67cbfeb8001cacdead02/files/67cc4f75002419fbfc11/view?project=67cbfcdd00313bbf5ea5&mode=admin';
        this.FEMALE_PROFILE_IMAGE = 'https://cloud.appwrite.io/v1/storage/buckets/67cbfeb8001cacdead02/files/67cc4f8400007b439e24/view?project=67cbfcdd00313bbf5ea5&mode=admin';
        const client = this.appwriteService.getClient();
        this.account = new node_appwrite_1.Account(client);
        this.databases = new node_appwrite_1.Databases(client);
    }
    async initiatePasswordRecovery(dto) {
        try {
            const { email } = dto;
            await this.account.createRecovery(email, this.RECOVERY_URL);
            return {
                message: 'Password recovery email sent successfully. Please check your email.',
            };
        }
        catch (error) {
            if (error.code === 404) {
                throw new common_1.HttpException({
                    message: 'Email not found',
                    code: error.code
                }, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException({
                message: error.message || 'Failed to initiate password recovery',
                code: error.code || 500
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async completePasswordRecovery(dto) {
        try {
            const { userId, secret, password } = dto;
            await this.account.updateRecovery(userId, secret, password);
            return {
                message: 'Password updated successfully',
            };
        }
        catch (error) {
            if (error.code === 401) {
                throw new common_1.HttpException({
                    message: 'Invalid or expired recovery details',
                    code: error.code
                }, common_1.HttpStatus.UNAUTHORIZED);
            }
            throw new common_1.HttpException({
                message: error.message || 'Failed to complete password recovery',
                code: error.code || 500
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async login(loginDto) {
        try {
            const { email, password } = loginDto;
            const session = await this.account.createEmailPasswordSession(email, password);
            const users = await this.databases.listDocuments(this.DATABASE_ID, this.COLLECTION_ID, [node_appwrite_1.Query.equal('email', email)]);
            if (!users.documents.length) {
                throw new common_1.HttpException({
                    message: 'User data not found',
                    code: 404
                }, common_1.HttpStatus.NOT_FOUND);
            }
            const userData = users.documents[0];
            return {
                message: 'Login successful',
                session: {
                    sessionId: session.$id,
                    userId: session.userId,
                    provider: session.provider,
                    providerUid: session.providerUid,
                    providerEmail: email
                },
                user: userData
            };
        }
        catch (error) {
            if (error.code === 401) {
                throw new common_1.HttpException({
                    message: 'Invalid email or password',
                    code: error.code
                }, common_1.HttpStatus.UNAUTHORIZED);
            }
            throw new common_1.HttpException({
                message: error.message || 'Something went wrong',
                code: error.code || 500
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async register(registerDto) {
        try {
            const { email, password, fullName, gender } = registerDto;
            const user = await this.account.create(node_appwrite_1.ID.unique(), email, password, fullName);
            const profileImage = gender === 'male' ? this.MALE_PROFILE_IMAGE : this.FEMALE_PROFILE_IMAGE;
            await this.databases.createDocument(this.DATABASE_ID, this.COLLECTION_ID, user.$id, {
                id: user.$id,
                email: user.email,
                fullName: user.name,
                gender,
                profileImage,
                creationTime: user.$createdAt
            });
            return {
                message: 'User registered successfully',
                user: {
                    id: user.$id,
                    email: user.email,
                    fullName: user.name,
                    gender,
                    profileImage,
                    createdAt: user.$createdAt
                }
            };
        }
        catch (error) {
            if (error.code === 409) {
                throw new common_1.HttpException({
                    message: error.message,
                    code: error.code,
                    type: error.type
                }, common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException({
                message: error.message || 'Something went wrong',
                code: error.code || 500
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCurrentUser(sessionId) {
        try {
            const session = await this.account.getSession(sessionId);
            const users = await this.databases.listDocuments(this.DATABASE_ID, this.COLLECTION_ID, [node_appwrite_1.Query.equal('id', session.userId)]);
            if (!users.documents.length) {
                throw new common_1.HttpException({
                    message: 'User not found',
                    code: 404
                }, common_1.HttpStatus.NOT_FOUND);
            }
            const userData = users.documents[0];
            return {
                id: userData.id,
                email: userData.email,
                fullName: userData.fullName,
                gender: userData.gender,
                profileImage: userData.profileImage
            };
        }
        catch (error) {
            if (error.code === 401) {
                throw new common_1.HttpException({
                    message: 'Invalid or expired session',
                    code: error.code
                }, common_1.HttpStatus.UNAUTHORIZED);
            }
            throw new common_1.HttpException({
                message: error.message || 'Failed to get user information',
                code: error.code || 500
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkLoginStatus(sessionId) {
        try {
            if (!sessionId) {
                return {
                    isLoggedIn: false,
                    message: 'No session ID provided'
                };
            }
            try {
                const session = await this.account.getSession(sessionId);
                const users = await this.databases.listDocuments(this.DATABASE_ID, this.COLLECTION_ID, [node_appwrite_1.Query.equal('email', session.providerEmail)]);
                if (!users.documents.length) {
                    return {
                        isLoggedIn: false,
                        message: 'User data not found'
                    };
                }
                const userData = users.documents[0];
                return {
                    isLoggedIn: true,
                    session: {
                        sessionId: session.$id,
                        userId: session.userId,
                        provider: session.provider,
                        providerEmail: session.providerEmail
                    },
                    user: {
                        id: userData.id,
                        email: userData.email,
                        fullName: userData.fullName,
                        gender: userData.gender,
                        profileImage: userData.profileImage
                    }
                };
            }
            catch (sessionError) {
                console.error('Session verification failed:', sessionError);
                return {
                    isLoggedIn: false,
                    message: 'Not authenticated'
                };
            }
        }
        catch (error) {
            console.error('Login status check failed:', error);
            return {
                isLoggedIn: false,
                message: error.message || 'Failed to check login status'
            };
        }
    }
    async getUserById(userId) {
        try {
            const users = await this.databases.listDocuments(this.DATABASE_ID, this.COLLECTION_ID, [node_appwrite_1.Query.equal('id', userId)]);
            if (!users.documents.length) {
                throw new common_1.HttpException({
                    message: 'User not found',
                    code: 404
                }, common_1.HttpStatus.NOT_FOUND);
            }
            const userData = users.documents[0];
            return {
                fullName: userData.fullName,
                gender: userData.gender,
                email: userData.email,
                profileImage: userData.profileImage
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                message: error.message || 'Failed to get user information',
                code: error.code || 500
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [appwrite_service_1.AppwriteService])
], AuthService);
//# sourceMappingURL=auth.service.js.map