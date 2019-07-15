import { RedisClient } from "redis";
import { promisify } from "util";
import { IAuthorizationCode, AuthorizationCodeValue } from "./AuthorizationCode";

export class AuthorizationCodeService {
  private get: (arg1: string) => Promise<string>;
  private set: (arg1: string, arg2: string) => Promise<unknown>;
  private del: (arg1: string) => Promise<unknown>;

  constructor(redisClient: RedisClient) {
    this.del = promisify(redisClient.del).bind(redisClient);
    this.set = promisify(redisClient.set).bind(redisClient);
    this.get = promisify(redisClient.get).bind(redisClient);
    this.createAuthorizationCode = this.createAuthorizationCode.bind(this);
    this.findAuthorizationCode = this.findAuthorizationCode.bind(this);
    this.deleteAuthorizationCode = this.deleteAuthorizationCode.bind(this);
  }

  public createAuthorizationCode(code: IAuthorizationCode) {
    this.set(code.value, JSON.stringify(code));
  }

  public async findAuthorizationCode(codeValue: AuthorizationCodeValue): Promise<IAuthorizationCode|null> {
    const json = await this.get(codeValue);
    return JSON.parse(json) as IAuthorizationCode;
  }

  public deleteAuthorizationCode(codeValue: AuthorizationCodeValue) {
    return this.del(codeValue);
  }
}
