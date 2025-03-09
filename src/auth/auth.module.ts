import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppwriteService } from '../appwrite/appwrite.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AppwriteService],
})
export class AuthModule {} 