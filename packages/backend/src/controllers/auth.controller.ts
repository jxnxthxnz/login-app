import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { RegisterRequest, LoginRequest } from '@login-app/shared';

export const authController = {
  //creates a new user, return 201 with result
  async register(
    //expect generic Express Request
    //params, resBody, reqBody
    req: Request<{}, {}, RegisterRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //contains user and accessToken
      const result = await authService.register(req.body); 

      res.status(201).json({
        success: true,
        data: result,
        message: 'Registration successful',
      });
    } catch (error) {
      next(error);
    }
  },

  //authenticate user, return access token in json body, set refresh token as httpOnly cookie
  async login(
    //change reqBody
    req: Request<{}, {}, LoginRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body);

      // Set refresh token in httpOnly cookie
      //Send to browser so it can use for subsequent requests to server
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, //js cant access token
        secure: process.env.NODE_ENV === 'production', //cookie only sent over https in prod, allow http in dev
        sameSite: 'strict', //only sent on same site requests
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        //dont send refresh, already set in cookie
        data: {
          user,
          accessToken,
        },
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  },

  //Generate new access token via refresh token
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Refresh token not provided',
            code: 'AUTHENTICATION_ERROR',
          },
        });
        return;
      }

      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  //Invalidate refresh token server side, clear cookie
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        //Invalidate in db
        await authService.logout(refreshToken);
      }

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  },

  //Returns authenticated user's profile
  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      //req.user injected upstream before reaching this step
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Not authenticated',
            code: 'AUTHENTICATION_ERROR',
          },
        });
        return;
      }

      const user = await authService.getCurrentUser(req.user.userId);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },
};
