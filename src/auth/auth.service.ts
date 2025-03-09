import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AppwriteService } from '../appwrite/appwrite.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InitiateRecoveryDto, CompleteRecoveryDto } from './dto/password-recovery.dto';
import { Client, ID, Account, Databases, Query } from 'node-appwrite';

@Injectable()
export class AuthService {
  private account: Account;
  private databases: Databases;
  private readonly DATABASE_ID = '67cbfe5200258ce8929d';
  private readonly COLLECTION_ID = '67cbfe5a00100d602269';
  private readonly RECOVERY_URL = 'http://localhost:3000/auth/recovery-callback';  // Update this with your frontend URL
  private readonly MALE_PROFILE_IMAGE = 'https://cloud.appwrite.io/v1/storage/buckets/67cbfeb8001cacdead02/files/67cc4f75002419fbfc11/view?project=67cbfcdd00313bbf5ea5&mode=admin';
  private readonly FEMALE_PROFILE_IMAGE = 'https://cloud.appwrite.io/v1/storage/buckets/67cbfeb8001cacdead02/files/67cc4f8400007b439e24/view?project=67cbfcdd00313bbf5ea5&mode=admin';

  constructor(private appwriteService: AppwriteService) {
    const client = this.appwriteService.getClient();
    this.account = new Account(client);
    this.databases = new Databases(client);
  }

  async initiatePasswordRecovery(dto: InitiateRecoveryDto) {
    try {
      const { email } = dto;

      // Create recovery
      await this.account.createRecovery(email, this.RECOVERY_URL);

      return {
        message: 'Password recovery email sent successfully. Please check your email.',
      };
    } catch (error) {
      if (error.code === 404) {
        throw new HttpException({
          message: 'Email not found',
          code: error.code
        }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({
        message: error.message || 'Failed to initiate password recovery',
        code: error.code || 500
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async completePasswordRecovery(dto: CompleteRecoveryDto) {
    try {
      const { userId, secret, password } = dto;

      // Complete recovery
      await this.account.updateRecovery(userId, secret, password);

      return {
        message: 'Password updated successfully',
      };
    } catch (error) {
      if (error.code === 401) {
        throw new HttpException({
          message: 'Invalid or expired recovery details',
          code: error.code
        }, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException({
        message: error.message || 'Failed to complete password recovery',
        code: error.code || 500
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      // Create email session
      const session = await this.account.createEmailPasswordSession(email, password);

      // Get user data from database
      const users = await this.databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [Query.equal('email', email)]
      );

      if (!users.documents.length) {
        throw new HttpException({
          message: 'User data not found',
          code: 404
        }, HttpStatus.NOT_FOUND);
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
    } catch (error) {
      if (error.code === 401) {
        throw new HttpException({
          message: 'Invalid email or password',
          code: error.code
        }, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException({
        message: error.message || 'Something went wrong',
        code: error.code || 500
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const { email, password, fullName, gender } = registerDto;

      // Create user account
      const user = await this.account.create(
        ID.unique(),
        email,
        password,
        fullName
      );

      // Store user data in database
      const profileImage = gender === 'male' ? this.MALE_PROFILE_IMAGE : this.FEMALE_PROFILE_IMAGE;
      
      await this.databases.createDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        user.$id,
        {
          id: user.$id,
          email: user.email,
          fullName: user.name,
          gender,
          profileImage,
          creationTime: user.$createdAt
        }
      );

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
    } catch (error) {
      if (error.code === 409) {
        throw new HttpException({
          message: error.message,
          code: error.code,
          type: error.type
        }, HttpStatus.CONFLICT);
      }
      throw new HttpException({
        message: error.message || 'Something went wrong',
        code: error.code || 500
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCurrentUser(sessionId: string) {
    try {
      // Get current session
      const session = await this.account.getSession(sessionId);
      
      // Get user data from database
      const users = await this.databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [Query.equal('id', session.userId)]
      );

      if (!users.documents.length) {
        throw new HttpException({
          message: 'User not found',
          code: 404
        }, HttpStatus.NOT_FOUND);
      }

      const userData = users.documents[0];

      return {
        id: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        gender: userData.gender,
        profileImage: userData.profileImage
      };
    } catch (error) {
      if (error.code === 401) {
        throw new HttpException({
          message: 'Invalid or expired session',
          code: error.code
        }, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException({
        message: error.message || 'Failed to get user information',
        code: error.code || 500
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkLoginStatus(sessionId: string) {
    try {
      if (!sessionId) {
        return {
          isLoggedIn: false,
          message: 'No session ID provided'
        };
      }

      try {
        const session = await this.account.getSession(sessionId);
        const users = await this.databases.listDocuments(
          this.DATABASE_ID,
          this.COLLECTION_ID,
          [Query.equal('email', session.providerEmail)]
        );

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
      } catch (sessionError) {
        console.error('Session verification failed:', sessionError);
        return {
          isLoggedIn: false,
          message: 'Not authenticated'
        };
      }
    } catch (error) {
      console.error('Login status check failed:', error);
      return {
        isLoggedIn: false,
        message: error.message || 'Failed to check login status'
      };
    }
  }

  async getUserById(userId: string) {
    try {
      const users = await this.databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [Query.equal('id', userId)]
      );

      if (!users.documents.length) {
        throw new HttpException({
          message: 'User not found',
          code: 404
        }, HttpStatus.NOT_FOUND);
      }

      const userData = users.documents[0];
      return {
        fullName: userData.fullName,
        gender: userData.gender,
        email: userData.email,
        profileImage: userData.profileImage
      };
    } catch (error) {
      throw new HttpException({
        message: error.message || 'Failed to get user information',
        code: error.code || 500
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 