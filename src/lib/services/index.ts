import redis from "redis";
import { AccessTokenService } from "./AccessTokenService/AccessTokenService";
import { AuthorizationCodeService } from "./AuthorizationCodeService/AuthorizationService";
const client = redis.createClient();

export const accessTokenService = new AccessTokenService(client);
export const authorizationCodeService = new AuthorizationCodeService(client);
