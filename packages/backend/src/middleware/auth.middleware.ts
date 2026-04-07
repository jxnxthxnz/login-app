import { Request, Response, NextFunction } from 'express';
import { tokenService, TokenPayload } from '../services/token.service';
import { AuthenticationError } from '../utils/errors';

//add a user property to express req object
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    //Check appropriate headers
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      //Get payload which is the user info
      const payload = tokenService.verifyAccessToken(token);
      req.user = payload;
      next(); //pass control
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  } catch (error) {
    next(error); //skip to express error handler
  }
};
