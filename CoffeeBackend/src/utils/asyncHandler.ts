import { NextFunction, Request, RequestHandler, Response } from "express";

// Express 4 не перехватывает ошибки из async-обработчиков —
// передаём их в errorHandler через next()
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
