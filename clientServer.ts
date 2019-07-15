import express, { Request, Response } from "express";
import { loginPage } from "./src/lib/auth/loginPage";
import axios from "axios";
import { IAccessTokenResponse } from "./src/lib/services/AccessTokenService/AccessToken";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", async (_: Request, res: Response) => {
  res.end(loginPage());
});

// when the users clicks login with oauth we request a auth code
app.post("/login", async (_: Request, res: Response) => {
  // we declare what resources we want to access
  const clientId = "some id";
  const scope = "profile";
  const redirectUrl = "http://localhost:3001/api/v1/code";
  const url = `http://localhost:3000/validate?clientId=${clientId}&scope=${scope}&redirectUrl=${redirectUrl}`;
  res.redirect(url);
});

// this is where the oauth provider will send the user with the created code
app.get("/api/v1/code", async (req: Request, res: Response) => {
  const code = req.query.code;
  const tokenRes = await axios.get(`http://localhost:3000/api/v1/auth/token?code=${code}`);
  const token = tokenRes.data as IAccessTokenResponse;

  const profile = await axios.request({
    method: "get",
    url: "http://localhost:3000/api/v1/users",
    headers: {
      authorization: `Bearer ${token.accessToken}`
    }
  });

  res.json(profile.data);
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("Running on port", port);
  console.log('--------------------------');
});
