import { Request, Response, NextFunction } from "express";
import { AccessTokenValue, IAccessToken } from "../services/AccessTokenService/AccessToken";
import { accessTokenService } from "../services";
import { Scope } from "../shared/models";

export const isValid = (...scopes: Scope[]) => async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({msg: "Missing accessToken"});
  }
  
  const tokenValue = auth.split(" ")[1] as AccessTokenValue;
  const token = await accessTokenService.findAccessToken(tokenValue);

  if(!token) {
    return res.status(404).json({msg: "No token found"});
  }

  if(hasExpired(token)) return res.status(401).json({msg: "Token expired"});

  const tokenScopes = token.scope.split(" ");
  const hasScope = scopes.every(scope => tokenScopes.includes(scope));

  if(hasScope) {
    return next();
  }

  return res.status(401).json({msg: "Token does not contain needed scope"});
}

export const hasExpired = (token: IAccessToken) => {
  const now = Date.now();
  const expiresAt = token.createdAt + (token.ttlInSeconds * 1000);
  return now > expiresAt;
}
