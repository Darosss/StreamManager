import { Model, model, Schema } from "mongoose";
import { AuthDocument } from "./types";
import { encryptionKey } from "@configs";
import { encryptToken } from "@utils";

const AuthSchema: Schema<AuthDocument> = new Schema(
  {
    accessToken: { type: String, required: true },
    authTag: { type: Buffer },
    ivAccessToken: { type: Buffer },
    refreshToken: { type: String, required: true },
    authTagRefreshToken: { type: Buffer },
    ivRefreshToken: { type: Buffer },
    expiresIn: { type: Number, required: true, default: 0 },
    obtainmentTimestamp: { type: Number, required: true, default: 0 },
    scope: [String],
    userId: { type: String }
  },
  {
    capped: { size: 100000, max: 1 }
  }
);

AuthSchema.pre("save", async function () {
  try {
    // Encrypt access token
    const accessToken = this.accessToken;
    const { iv: ivAccessToken, encrypted: encryptedAccessToken, authTag } = encryptToken(accessToken, encryptionKey);
    this.accessToken = encryptedAccessToken;
    this.ivAccessToken = ivAccessToken;
    this.authTag = authTag;

    // Encrypt refresh token
    const refreshToken = this.refreshToken;
    const {
      iv: ivRefreshToken,
      encrypted: encryptedRefreshToken,
      authTag: authTagRefreshToken
    } = encryptToken(refreshToken, encryptionKey);
    this.refreshToken = encryptedRefreshToken;
    this.ivRefreshToken = ivRefreshToken;
    this.authTagRefreshToken = authTagRefreshToken;
  } catch (err) {
    throw err;
  }
});

export const AuthToken: Model<AuthDocument> = model("AuthTokens", AuthSchema);
