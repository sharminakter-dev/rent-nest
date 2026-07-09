import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma";

const app:Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true
}));

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.get("/", async(req: Request, res: Response)=>{
    const users = await prisma.user.findMany();
    console.log(users);
    res.send("hello world");
});

app.use("/api/auth",()=>{});


export default app;