import { configDotenv } from "dotenv";
import path from "node:path";
import { env } from "node:process";

configDotenv({path: path.resolve(process.cwd(), ".env"), quiet:true});

export default {
    port: env.PORT || 5000,
    app_url: env.APP_URL,
}