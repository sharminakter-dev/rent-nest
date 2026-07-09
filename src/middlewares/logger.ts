import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction)=>{
    const log = `\nTime: [${new Date().toLocaleString()}], method: ${req.method}, url: ${req.url}\n`;
    // console.log(log);
    // fs.appendFile("logger.txt", log, (err)=>{
    //     if(err){
    //         console.log(err);
    //     }
    // });
    next();
}

export default logger;