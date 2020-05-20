import jwt, {VerifyErrors} from "jsonwebtoken";
import {NextFunction} from "express";

const socketAuth = (socket: any, next: NextFunction) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, 'secret', (err: VerifyErrors|null , decoded: any) => {
            if(err) {
                console.log("jwt.verify error: ", err)
                return next(new Error('Authentication error'));
            }
            socket.decoded = decoded;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
}

export default socketAuth;