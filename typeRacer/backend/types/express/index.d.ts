// types/express/index.d.ts

declare namespace Express {
  interface Request {
    user?: {
      id: string;
      name?: string;
    } | null;
  }
}
