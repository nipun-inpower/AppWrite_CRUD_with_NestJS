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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const password_recovery_dto_1 = require("./dto/password-recovery.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.FRONTEND_RECOVERY_URL = 'http://localhost:4200/reset-password';
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async checkLoginStatus(sessionId, fallbackSessionId) {
        const finalSessionId = sessionId || fallbackSessionId;
        return this.authService.checkLoginStatus(finalSessionId);
    }
    async getCurrentUser(sessionId, fallbackSessionId) {
        const finalSessionId = sessionId || fallbackSessionId;
        return this.authService.getCurrentUser(finalSessionId);
    }
    async initiatePasswordRecovery(dto) {
        return this.authService.initiatePasswordRecovery(dto);
    }
    async handleRecoveryCallback(userId, secret, res) {
        const redirectUrl = `${this.FRONTEND_RECOVERY_URL}?userId=${userId}&secret=${secret}`;
        return res.redirect(redirectUrl);
    }
    async completePasswordRecovery(dto) {
        return this.authService.completePasswordRecovery(dto);
    }
    async getUserById(userId) {
        return this.authService.getUserById(userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('check-status'),
    __param(0, (0, common_1.Headers)('x-appwrite-session-id')),
    __param(1, (0, common_1.Headers)('x-appwrite-session')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkLoginStatus", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Headers)('x-appwrite-session-id')),
    __param(1, (0, common_1.Headers)('x-appwrite-session')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Post)('password-recovery'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_recovery_dto_1.InitiateRecoveryDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "initiatePasswordRecovery", null);
__decorate([
    (0, common_1.Get)('recovery-callback'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('secret')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleRecoveryCallback", null);
__decorate([
    (0, common_1.Post)('password-recovery/complete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_recovery_dto_1.CompleteRecoveryDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "completePasswordRecovery", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserById", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map