import {Request, Response, NextFunction} from "express";
import { User } from "../models/User";

const userController = {

    get(req: Request, res: Response): void {
        User.findOne({_id: req.body.id}, (err, user) => {
            if (err) console.error('ERROR!');

            if (user) {
                const {username, color} = user;
                const sources = {
                    username: username,
                    color: color,
                };
                const profileData = Object.assign({}, sources);
                return res.json(profileData)
            }
        });
    },

    update(req: Request): void {
        User.findByIdAndUpdate(req.body.user.id, {$set: req.body.user.data}, {strict: false, new: true}, (err) => {
            if(err) return new Error('Error in save');
        });
    },
    updateHistory(id: string, data: any): void {
        User.findByIdAndUpdate(id, {$push: {"history": data}}, {strict: false, new: true}, (err) => {
            if(err) return new Error('Error in save');
        });
    },

};

export default userController;
