import Mongoose from "mongoose";
import {Strategy as LocalStrategy} from "passport-local";
// import {User as IUser} from "../models/User";

const User = Mongoose.model('User');

const strategy = new LocalStrategy({
    usernameField: 'user[login]',
    passwordField: 'user[password]',
}, (login: string, password: string, done: any) => {
    User.findOne({login})
        .then((user: any) => {
            if(!user || !user.validatePassword(password)) {
                return done(null, false, {
                    errors: {
                        'login or password': 'is valide'
                    }
                });
            }

            return done(null, user);
        })
        .catch(done)
});

export default strategy;