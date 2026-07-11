import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma";
import { authRoutes } from "./modules/auth/auth.route.";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import logger from "./middlewares/logger";
import { landlordRoutes } from "./modules/landlord/landlord.route";
import { propertyRoutes } from "./modules/properties/properties.route";
import { categoryRoutes } from "./modules/categories/categories.route";
import { rentalRoutes } from "./modules/rentals/rentals.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/reviews/reviews";
import { adminRoutes } from "./modules/admin/admin.router";

const app:Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true
}));

app.use("/api/payments/confirm", express.raw({type: 'application/json'}));

app.use(logger);
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.get("/", async(req: Request, res: Response)=>{
    const users = await prisma.user.findMany();
    console.log(users);
    res.send("hello world");
});

app.use("/api/auth", authRoutes);
app.use("/api/landlord", landlordRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);


app.use(notFound);
app.use(globalErrorHandler);

// ! remove comment from logger.ts before deploy

export default app;