import { Body, Controller, Post, Get, Query, Res, Headers, Param } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InitiateRecoveryDto, CompleteRecoveryDto } from './dto/password-recovery.dto';

@Controller('auth')
export class AuthController {
  private readonly FRONTEND_RECOVERY_URL = 'http://localhost:4200/reset-password'; // Update this with your frontend URL

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('check-status')
  async checkLoginStatus(
    @Headers('x-appwrite-session-id') sessionId?: string,
    @Headers('x-appwrite-session') fallbackSessionId?: string
  ) {
    // Try both header formats
    const finalSessionId = sessionId || fallbackSessionId;
    return this.authService.checkLoginStatus(finalSessionId);
  }

  @Get('me')
  async getCurrentUser(
    @Headers('x-appwrite-session-id') sessionId?: string,
    @Headers('x-appwrite-session') fallbackSessionId?: string
  ) {
    const finalSessionId = sessionId || fallbackSessionId;
    return this.authService.getCurrentUser(finalSessionId);
  }

  @Post('password-recovery')
  async initiatePasswordRecovery(@Body() dto: InitiateRecoveryDto) {
    return this.authService.initiatePasswordRecovery(dto);
  }

  @Get('recovery-callback')
  async handleRecoveryCallback(
    @Query('userId') userId: string,
    @Query('secret') secret: string,
    @Res() res: Response
  ) {
    // Redirect to frontend with the recovery parameters
    const redirectUrl = `${this.FRONTEND_RECOVERY_URL}?userId=${userId}&secret=${secret}`;
    return res.redirect(redirectUrl);
  }

  @Post('password-recovery/complete')
  async completePasswordRecovery(@Body() dto: CompleteRecoveryDto) {
    return this.authService.completePasswordRecovery(dto);
  }

  @Get('user/:id')
  async getUserById(@Param('id') userId: string) {
    return this.authService.getUserById(userId);
  }
} 