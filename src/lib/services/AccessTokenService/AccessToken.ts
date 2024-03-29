import crypto from "crypto";
import { Scope, ClientId, UserId } from "../../shared/models";
export type AccessTokenValue = string;

const TTL = 3600;

export interface IAccessToken {
  scope: Scope;
  clientId: ClientId;
  userId: UserId;
  ttlInSeconds: number;
  createdAt: number;
  value: AccessTokenValue;
}

export const AccessToken = (clientId: ClientId, scope: Scope, userId: UserId) => {
  return {
    userId,
    ttlInSeconds: TTL,
    createdAt: new Date().getTime(),
    value: crypto.randomBytes(128).toString("base64"),
    clientId,
    scope
  }
}

export interface IAccessTokenResponse {
  ttlInSeconds: number;
  type: "Bearer";
  accessToken: AccessTokenValue;
}

export const AccessTokenResponse = (accessToken: AccessTokenValue) => {
  return {
    ttlInSeconds: TTL,
    type: "Bearer",
    accessToken
  }
}
