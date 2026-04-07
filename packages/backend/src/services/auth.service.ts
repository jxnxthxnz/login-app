import { RegisterRequest, LoginRequest, UserDTO } from '@login-app/shared';
import { userModel } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/hash';
import { tokenService, TokenPayload } from './token.service';
import { ConflictError, AuthenticationError, ValidationError } from '../utils/errors';

export const authService = {
  async register(data: RegisterRequest): Promise<{ user: UserDTO; accessToken: string }> {
    // Check if email already exists
    const existingEmail = await userModel.findByEmail(data.email);
    if (existingEmail) {
      throw new ConflictError('Email already exists');
    }

    // Check if username already exists
    const existingUsername = await userModel.findByUsername(data.userName);
    if (existingUsername) {
      throw new ConflictError('Username already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await userModel.create({
      email: data.email.toLowerCase(),
      username: data.userName.toLowerCase(),
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = tokenService.generateAccessToken(tokenPayload);
    const refreshToken = tokenService.generateRefreshToken(tokenPayload);

    // Save refresh token
    await tokenService.saveRefreshToken(user.id, refreshToken);

    return {
      user: userModel.toDTO(user),
      accessToken,
    };
  },

  async login(data: LoginRequest): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
    // Find user by email
    const user = await userModel.findByEmail(data.email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password_hash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AuthenticationError('Account is inactive');
    }

    // Update last login
    await userModel.updateLastLogin(user.id);

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = tokenService.generateAccessToken(tokenPayload);
    const refreshToken = tokenService.generateRefreshToken(tokenPayload);

    // Save refresh token
    await tokenService.saveRefreshToken(user.id, refreshToken);

    return {
      user: userModel.toDTO(user),
      accessToken,
      refreshToken,
    };
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Verify refresh token
    let payload: TokenPayload; //declare but assign later
    try {
      payload = tokenService.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Check if refresh token exists in database
    const storedToken = await tokenService.findRefreshToken(refreshToken);
    if (!storedToken) {
      throw new AuthenticationError('Refresh token not found or expired');
    }

    // Generate new access token
    const accessToken = tokenService.generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
    });

    return { accessToken };
  },

  async logout(refreshToken: string): Promise<void> {
    await tokenService.revokeRefreshToken(refreshToken);
  },

  async getCurrentUser(userId: number): Promise<UserDTO> {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    return userModel.toDTO(user);
  },
};
