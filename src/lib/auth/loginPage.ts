export const loginPage = () => {
  return `
    <html>
      <body>
        <h1>Login</h1>
        <form method="POST" action="/login">
          <input type="submit" value="Login with Oauth">
        </form>
      </body>
    </html>
  `;
}