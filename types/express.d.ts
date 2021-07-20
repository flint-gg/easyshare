import { switchShareUserToken } from './flintgg';

declare namespace Express {
  export interface Request {
    user: switchShareUserToken;
  }
}
