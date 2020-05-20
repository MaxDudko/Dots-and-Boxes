import passport from "passport";
import {Request, Response, NextFunction} from "express";
import { User } from "../models/User";

export interface AppRequest extends Request {
    payload?: any;
}

const validate = (reqData: { [key: string]: string }, key: string, res: Response): Response|undefined => {
    if(!reqData[key]) {
        return res.status(422).json({
            errors: {
                [key]: 'is Required',
            },
        });
    }
};

const authController = {

    register(req: Request, res: Response): {} {
        const { body: { user } } = req;

        validate(user, "login", res);
        validate(user, "password", res);

        const finalUser = new User(user);

        finalUser.setPassword(user.password);

        return finalUser.save()
            .then(() => res.json({ user: finalUser.toAuthJSON() }));
    },

    login(req: Request, res: Response, next: NextFunction): {} {
        const { body: { user } } = req;

        validate(user, "login", res);
        validate(user, "login", res);

        return passport.authenticate('local', { session: false }, (err, passportUser) => {
            if(err) {
                return next(err);
            }

            if(passportUser) {
                const user = passportUser;
                user.token = passportUser.generateJWT();

                return res.json({ user: user.toAuthJSON() });
            }

            return res.status(400).json({
                errors: {
                    password: 'is Required',
                },
            });
        })(req, res, next);
    },

    check(req: AppRequest, res: Response): {} {
        console.log(req.payload)
        const { payload: { id } } = req;

        return User.findById(id)
            .then((user) => {
                if(!user) {
                    return res.sendStatus(400);
                }

                return res.json({ user: user.toAuthJSON() });
            });
    },

};

export default authController;
