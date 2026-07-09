import type { Request, Response } from "express";

export const notFound = (req: Request, res: Response)=>{
res.status(404).send({
    message: "Route Not Found.",
    path: req.originalUrl,
    date: new Date()
})
}