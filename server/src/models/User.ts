import Mongoose, {Schema} from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export interface User extends Mongoose.Document {
    login: string;
    hash: string;
    salt: string;
    username: string;
    color: string;
    scores: number;
    setPassword(password: string): void;
    validatePassword(password: string): boolean;

    toAuthJSON(): {[key: string]: string | number};
}

const HistorySchema: Schema = new Mongoose.Schema({
    date: String,
    players: [String, String],
    colors: [String, String],
    score: [Number, Number],
})
const UserSchema: Schema = new Mongoose.Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    hash: String,
    salt: String,
    username: {
        type: String,
        unique: false,
        required: false,
        default: "Anonymous"
    },
    color: {
        type: String,
        unique: false,
        required: true,
    },
    scores: {
        type: String,
        unique: false,
        required: true,
        default: 0
    },
    history: [HistorySchema]
});

UserSchema.methods.setPassword = function(password: string): void {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};
UserSchema.methods.validatePassword = function(password: string): boolean {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};
UserSchema.methods.generateJWT = function (): string {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        login: this.login,
        id: this._id,
        exp: parseInt(String(expirationDate.getTime() / 1000), 10),

    }, 'secret')
};
UserSchema.methods.toAuthJSON = function (): {[key: string]: string | number} {
    return {
        _id: this._id,
        login: this.login,
        token: this.generateJWT(),
        username: this.username,
        color: this.color,
        scores: this.scores,
    }
};

export const User = Mongoose.model<User>('User', UserSchema);