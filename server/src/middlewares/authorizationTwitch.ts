import { RequestQueryAuthorizationTwitch, AuthorizationTwitch } from "@controllers";
import { AppError, retryWithCatch } from "@utils";
import { NextFunction, Request, Response } from "express";
import { createNewAuth } from "@services";
import { clientId, clientSecret, redirectUrl } from "@configs";
import init from "../stream/initializeHandlers";

export const authorizationTwitch = async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.query as unknown as RequestQueryAuthorizationTwitch;
  const authRes = await retryWithCatch(() =>
    fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUrl
      }).toString()
    })
  );

  if (authRes) {
    const authTwitchJson = (await authRes.json()) as AuthorizationTwitch;
    const token = await createNewAuth({
      accessToken: authTwitchJson.access_token,
      refreshToken: authTwitchJson.refresh_token,
      expiresIn: authTwitchJson.expires_in,
      obtainmentTimestamp: new Date().getTime(),
      scope: authTwitchJson.scope
    });

    if (!token) return next(new AppError(400, "Token not found, try again"));
    await init(token);

    return next();
  }
};
