import { Request } from 'express';

export default interface AuthenticatedRequest extends Request {
  user: {
    sub: string
  };
}
