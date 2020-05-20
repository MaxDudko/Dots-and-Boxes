import jwt from "express-jwt";
import { Request } from "express";

const getTokenFromHeader = (req: Request): string | null => {
    const { headers: {authorization} } = req;

    if(authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return null;
};

const auth = {
    required: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeader,
    }),
    optional: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeader,
        credentialsRequired: false
    }),
};

export default auth;
