import { Document, Types } from "mongoose";

export interface AuthModel {
  _id: Types.ObjectId;
  accessToken: string;
  authTag: Buffer;
  ivAccessToken: Buffer;
  authTagRefreshToken: Buffer;
  refreshToken: string;
  ivRefreshToken: Buffer;
  expiresIn: number;
  obtainmentTimestamp: number;
  scope: string[];
  userId: string;
}

export type AuthDocument = AuthModel & Document;
