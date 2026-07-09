import { configDotenv } from "dotenv";
import path from "node:path";
import { env } from "node:process";

configDotenv({path: path.resolve(process.cwd(), ".env"), quiet:true});

export default {
    port: env.PORT || 5000,
    app_url: env.APP_URL,
    bcrypt_salt_rounds : env.BCRYPT_SALT_ROUNDS!,
    jwt_access_secret: env.JWT_ACCESS_SECRET!,
    jwt_access_expires_in: env.JWT_ACCESS_EXPIRES_IN!,
    jwt_refresh_secret: env.JWT_REFRESH_SECRET!,
    jwt_refresh_expires_in: env.JWT_REFRESH_EXPIRES_IN!
}