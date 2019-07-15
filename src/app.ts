import express, { Request, Response } from "express";
import { users } from "./lib/constants/users";
import { isValid } from "./lib/middleware/isValid";
import { consentPage } from "./lib/auth/consentPage";
import { AuthorizationCode } from "./lib/services/AuthorizationCodeService/AuthorizationCode";
import { authorizationCodeService, accessTokenService } from "./lib/services";
import { AccessToken, AccessTokenResponse, AccessTokenValue } from "./lib/services/AccessTokenService/AccessToken";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// this is where the client will submit the validation code
app.get("/api/v1/auth/token", async (req: Request, res: Response) => {
  const code = await authorizationCodeService.findAuthorizationCode(req.query.code);
  if(!code) return res.status(404).end("Code not found");

  const token = AccessToken(code.clientId, code.scope, code.userId);
  await accessTokenService.createAccessToken(token);
  // naive implementation, we really have to be sure the code is gone so it can't be used again
  await authorizationCodeService.deleteAuthorizationCode(code.value);

  res.json(AccessTokenResponse(token.value));
});

// this is the url we expect the client to send the user to so they can give their consent
// If the users isn't logged in to the oauth provider we will send them to a login page
// where they need to input their username and password so we can get a session to verify
// that the user who is giving their consent owns the account they are giving it for
app.get("/validate", async (req: Request, res: Response) => {
  /**
   * In a production situation we would validate that the redirectUrl
   * is the url registered by the third party with the provided clientId, 
   * otherwise a hacker could send a user to our flow and then redirect 
   * to a untrusted site
   */
  const {clientId, scope, redirectUrl} = req.query;
  const userId = users[0].id; // Normally we would get this from the users session
  const code = AuthorizationCode(clientId, scope, redirectUrl, userId);
  await authorizationCodeService.createAuthorizationCode(code);
  res.end(consentPage(code));
});

// when the users gives their consent we expect the form to land here
app.post("/validate", async (req: Request, res: Response) => {
  const codeValue = req.body.code;
  const authCode = await authorizationCodeService.findAuthorizationCode(codeValue);
  if(!authCode) return res.status(400).end("Something whent wrong");

  // authCode.userId === req.session.userId, need to make sure the user is who they claim to be

  res.redirect(authCode.redirectUrl + `?code=${authCode.value}`);
});

// Oauth secured routes
app.get("/api/v1/users", isValid("profile"), async (req: Request, res: Response) => {
  const authToken = req.headers.authorization;
  if (!authToken) return res.status(400).end("Missing auth token");

  const tokenValue = authToken.split(" ")[1] as AccessTokenValue;
  const token = await accessTokenService.findAccessToken(tokenValue);
  if(!token) return res.status(404).end("404");

  res.json(users.find(u => u.id == token.userId));
});
