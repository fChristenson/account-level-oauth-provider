import crypto from "crypto";
import { Scope, ClientId, UserId } from "../../shared/models";
export type AuthorizationCodeValue = string;

export interface IAuthorizationCode {
  clientId: ClientId;
  userId: UserId;
  scope: Scope;
  redirectUrl: string;
  createdAt: number;
  value: AuthorizationCodeValue;
}

export const AuthorizationCode = (clientId: ClientId, scope: Scope, redirectUrl: string, userId: UserId) => {
  return {
    userId,
    clientId,
    createdAt: new Date().getTime(),
    value: crypto.randomBytes(128).toString("hex"),
    scope,
    redirectUrl
  }
}

export const AuthorizationCodeResponse = (code: IAuthorizationCode) => {
  return {
    url: `http://localhost:3000/validate?code=${code.value}`
  }
}
