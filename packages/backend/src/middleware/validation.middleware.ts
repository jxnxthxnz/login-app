import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      //verify the raw json against schema
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      //zod provides an array of all the things that failed
      //loop over each error and shape into path/message object
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          path: err.path.join('.'), //where in the object the failure was
          //. for nested arrays, merge them
          message: err.message,
        }));
        next(new ValidationError('Validation failed', details));
      } else {
        //some other error
        next(error);
      }
    }
  };
};
