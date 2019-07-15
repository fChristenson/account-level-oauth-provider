import { IAuthorizationCode } from "../services/AuthorizationCodeService/AuthorizationCode";

export const consentPage = (code: IAuthorizationCode) => {
  return `
    <html>
      <body>
        <h1>I give my consent</h1>
        <p>
          Here we put a list of all the things the third party 
          system will have access to if the user gives their consent.
        </p>
        <ul>${code.scope.split(" ").map(s => `<li>${s}</li>`).join("")}</ul>
        <form method="POST" action="/validate">
          <input type="hidden" name="code" value="${code.value}" />
          <input type="submit" value="I consent">
        </form>
      </body>
    </html>
  `;
}