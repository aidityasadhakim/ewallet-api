import { expressjwt } from "express-jwt";

function authJwt() {
  const secret = process.env.JWT_SECRET_KEY;

  return expressjwt({
    secret: secret,
    algorithms: ["HS256"],
  }).unless({
    path: ["api/v1/login", "api/v1/register"],
  });
}

export default authJwt;
